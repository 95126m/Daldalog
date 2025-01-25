/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { fontSize } from '@/constants/font';
import { color } from '@/constants/color';
import { useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  orderBy,
} from 'firebase/firestore';
import Loading from '@/components/Loading';

interface Post {
  id: string;
  title: string;
  groupTitle: string;
  content: string;
  date: Date | string;
  image?: string;
}

const SearchDetail = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filteredData, setFilteredData] = useState<Post[]>([]);
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('query') || ''; // 검색어 추출
  const firestore = getFirestore();

  useEffect(() => {
    const fetchFilteredPosts = async () => {
      if (!searchQuery.trim()) return;

      setIsLoading(true);

      try {
        const postsCollection = collection(firestore, 'posts');
        const postsQuery = query(
          postsCollection,
          where('title', '>=', searchQuery), // 제목이 검색어로 시작하는 조건
          where('title', '<=', searchQuery + '\uf8ff'), // 제목이 검색어로 끝나는 조건
          orderBy('title', 'asc')
        );
        const snapshot = await getDocs(postsQuery);

        if (!snapshot.empty) {
          const postsArray: Post[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            title: doc.data().title,
            groupTitle: doc.data().groupTitle,
            content: doc.data().content,
            date: doc.data().date.toDate(),
            image: doc.data().image || '',
          }));
          setFilteredData(postsArray);
        } else {
          setFilteredData([]);
        }
      } catch (error) {
        console.error('검색 데이터를 가져오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFilteredPosts();
  }, [searchQuery, firestore]);

  return (
    <div css={wrapperStyle}>
      <div css={headerStyle}>
        <h1>"{searchQuery}"에 대한 검색 결과</h1>
      </div>
      <div css={contentStyle}>
        {isLoading ? (
          <Loading />
        ) : filteredData.length > 0 ? (
          filteredData.map((post) => (
            <div key={post.id} css={postStyle}>
              <img src={post.image || ''} alt={post.title} />
              <div className="text-content">
                <h2>{post.title}</h2>
                <p>{post.content}</p>
                <p>{post.date instanceof Date ? post.date.toLocaleDateString() : post.date}</p>
              </div>
            </div>
          ))
        ) : (
          <p css={noResultStyle}>검색 결과가 없습니다.</p>
        )}
      </div>
    </div>
  );
};

export default SearchDetail;

const wrapperStyle = css`
  width: 100%;
  padding: 20px;
`;

const headerStyle = css`
  margin-bottom: 20px;
  h1 {
    font-size: ${fontSize.lg};
    color: ${color.yellow};
    border-bottom: 1px solid ${color.gray};
    padding-bottom: 10px;
  }
`;

const contentStyle = css`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const postStyle = css`
  display: flex;
  gap: 20px;
  align-items: center;

  img {
    width: 150px;
    height: 100px;
    object-fit: cover;
    border: 1px solid ${color.lightGray};
  }

  .text-content {
    h2 {
      font-size: ${fontSize.md};
      color: ${color.darkYellow};
    }
    p {
      font-size: ${fontSize.sm};
      color: ${color.black};
    }
  }
`;

const noResultStyle = css`
  text-align: center;
  font-size: ${fontSize.sm};
  color: ${color.gray};
`;
