import { create } from 'zustand'
import {
  getFirestore,
  collection,
  getDocs,
  query,
  orderBy
} from 'firebase/firestore'

interface Post {
  id: string
  title: string
  groupTitle: string
  content: string
  date: Date | string | null
  image?: string
  thumbnail?: string
}

interface PostsState {
  postsData: Post[]
  isLoading: boolean
  fetchPosts: () => Promise<void>
}

export const usePostsStore = create<PostsState>(set => {
  const firestore = getFirestore()

  return {
    postsData: [],
    isLoading: false,

    fetchPosts: async () => {
      set({ isLoading: true })

      try {
        const postsCollection = collection(firestore, 'posts')
        const postsQuery = query(postsCollection, orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(postsQuery)

        if (!snapshot.empty) {
          const postsArray: Post[] = snapshot.docs.map(doc => {
            const postData = doc.data()
            return {
              id: doc.id,
              title: postData.title,
              groupTitle: postData.groupTitle,
              content: postData.content,
              date: postData.date?.seconds
                ? new Date(postData.date.seconds * 1000)
                : ((postData.date as string) ?? null),
              createdAt: postData.createdAt?.seconds
                ? new Date(postData.createdAt.seconds * 1000)
                : new Date().toLocaleString(),
              image: postData.image || '',
              thumbnail: postData.thumbnail || ''
            }
          })

          set({ postsData: postsArray })
        } else {
          console.log('Firestore 데이터가 없습니다.')
        }
      } catch (error) {
        console.error('Firestore에서 데이터 가져오기 실패:', error)
      } finally {
        set({ isLoading: false })
      }
    }
  }
})
