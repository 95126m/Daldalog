import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();

// CORS 설정
app.use(cors({
  origin: 'http://localhost:5173',  // 클라이언트의 URL을 명시적으로 허용
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],         // 허용할 HTTP 메소드
}));

// JSON 형식으로 요청 본문을 파싱
app.use(bodyParser.json());

// 업로드 엔드포인트
app.post('/upload', (req, res) => {
  console.log('Request body:', req.body); // 요청 본문 출력

  const { fileUrl, fileName } = req.body;

  if (!fileUrl || !fileName) {
    return res.status(400).json({ error: 'fileUrl and fileName are required' });
  }

  // Firebase에 업로드하는 코드 추가 (혹은 서버에서 처리)
  // 예시로 간단히 URL만 반환
  res.status(200).json({ fileUrl: 'http://example.com/uploaded-image.jpg' });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
