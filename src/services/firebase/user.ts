//@ts-nocheck
import {
  addDoc,
  setDoc,
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  query,
  where,
  serverTimestamp,
  orderBy,
  limit,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '.'

export async function markAttendance(userId: string) {
  const attendanceRef = collection(db, 'mudra_signs_attendance_records')

  // Get current date boundaries
  const now = new Date()
  const startOfDay = new Date(now)
  startOfDay.setHours(0, 0, 0, 0)
  const endOfDay = new Date(now)
  endOfDay.setHours(23, 59, 59, 999)

  const q = query(
    attendanceRef,
    where('userId', '==', userId),
    where('date', '>=', startOfDay),
    where('date', '<=', endOfDay)
  )

  const snapshot = await getDocs(q)

  if (snapshot.empty) {
    await addDoc(attendanceRef, {
      userId,
      date: serverTimestamp(),
      loginTime: serverTimestamp(),
      logoutTime: null,
      totalHours: 0,
      autoLoggedOut: false,
      status: 'logged_in',
    })
  }
}

export async function markLogout(userId: string) {
  const q = query(
    collection(db, 'mudra_signs_attendance_records'),
    where('userId', '==', userId),
    where('logoutTime', '==', null),
    orderBy('loginTime', 'desc'),
    limit(1)
  )

  const snapshot = await getDocs(q)

  if (!snapshot.empty) {
    const docRef = doc(
      db,
      'mudra_signs_attendance_records',
      snapshot.docs[0].id
    )
    const loginTime = snapshot.docs[0].data().loginTime.toDate()
    const logoutTime = new Date()

    await updateDoc(docRef, {
      logoutTime: serverTimestamp(),
      totalHours: Math.round((logoutTime - loginTime) / (1000 * 60)), // in minutes
      status: 'completed',
    })
  }
}

export async function handleAutoLogout() {
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0) // Next midnight

  const q = query(
    collection(db, 'mudra_signs_attendance_records'),
    where('logoutTime', '==', null),
    where('loginTime', '<=', midnight)
  )

  const snapshot = await getDocs(q)

  snapshot.forEach(async (doc) => {
    const docRef = doc.ref
    const loginTime = doc.data().loginTime.toDate()
    const logoutTime = new Date(midnight)

    await updateDoc(docRef, {
      logoutTime: logoutTime,
      totalHours: Math.round((logoutTime - loginTime) / (1000 * 60)),
      autoLoggedOut: true,
      status: 'auto_completed',
    })
  })
}

export async function getAttendanceHistory(userId: string) {
  const q = query(
    collection(db, 'mudra_signs_attendance_records'),
    where('userId', '==', userId),
    orderBy('loginTime', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}

export async function getAllAttendanceHistory() {
  const q = query(
    collection(db, 'mudra_signs_attendance_records'),
    orderBy('loginTime', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
}
