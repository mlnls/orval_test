import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import cors from "cors";

const app = express();
const PORT = 3001;

// 미들웨어
app.use(cors());
app.use(express.json());

// 인메모리 데이터 (겉보기용)
let users = [
  { id: 1, name: "홍길동", email: "hong@example.com", age: 30 },
  { id: 2, name: "김철수", email: "kim@example.com", age: 25 },
  { id: 3, name: "이영희", email: "lee@example.com", age: 28 },
];

let posts = [
  {
    id: 1,
    title: "첫 번째 게시글",
    content: "안녕하세요!",
    authorId: 1,
    categoryId: 1,
    views: 100,
    likes: 10,
    createdAt: "2024-01-01",
  },
  {
    id: 2,
    title: "두 번째 게시글",
    content: "반갑습니다!",
    authorId: 2,
    categoryId: 2,
    views: 50,
    likes: 5,
    createdAt: "2024-01-02",
  },
  {
    id: 3,
    title: "세 번째 게시글",
    content: "좋은 하루 되세요!",
    authorId: 1,
    categoryId: 1,
    views: 200,
    likes: 20,
    createdAt: "2024-01-03",
  },
];

let comments = [
  {
    id: 1,
    postId: 1,
    userId: 2,
    content: "좋은 글 감사합니다!",
    createdAt: "2024-01-01T10:00:00",
  },
  {
    id: 2,
    postId: 1,
    userId: 3,
    content: "정말 유용한 정보네요.",
    createdAt: "2024-01-01T11:00:00",
  },
  {
    id: 3,
    postId: 2,
    userId: 1,
    content: "공감합니다!",
    createdAt: "2024-01-02T09:00:00",
  },
];

let categories = [
  { id: 1, name: "공지사항", description: "중요한 공지사항", postCount: 2 },
  {
    id: 2,
    name: "자유게시판",
    description: "자유롭게 글을 쓸 수 있는 게시판",
    postCount: 1,
  },
  { id: 3, name: "질문게시판", description: "질문과 답변", postCount: 0 },
];

let products = [
  {
    id: 1,
    name: "노트북",
    price: 1200000,
    category: "전자제품",
    stock: 10,
    description: "고성능 노트북",
  },
  {
    id: 2,
    name: "마우스",
    price: 50000,
    category: "전자제품",
    stock: 50,
    description: "무선 마우스",
  },
  {
    id: 3,
    name: "키보드",
    price: 150000,
    category: "전자제품",
    stock: 30,
    description: "기계식 키보드",
  },
];

// Swagger 설정
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sample API",
      version: "1.0.0",
      description: "겉보기용 샘플 API 문서",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "로컬 개발 서버",
      },
    ],
  },
  apis: ["./server/index.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Swagger JSON 엔드포인트 (orval용)
app.get("/api-docs.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// ==================== 사용자 API ====================

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: 모든 사용자 조회
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: 사용자 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 */
app.get("/api/users", (req, res) => {
  res.json(users);
});

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: 특정 사용자 조회
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: 사용자 ID
 *     responses:
 *       200:
 *         description: 사용자 정보
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       404:
 *         description: 사용자를 찾을 수 없음
 */
app.get("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
  }
  res.json(user);
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: 새 사용자 생성
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       201:
 *         description: 생성된 사용자
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 */
app.post("/api/users", (req, res) => {
  const { name, email, age } = req.body;
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    name,
    email,
    age: age || null,
  };
  users.push(newUser);
  res.status(201).json(newUser);
});

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: 사용자 정보 수정
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 수정된 사용자
 *       404:
 *         description: 사용자를 찾을 수 없음
 */
app.put("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
  }
  users[userIndex] = { ...users[userIndex], ...req.body };
  res.json(users[userIndex]);
});

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: 사용자 삭제
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 삭제 성공
 *       404:
 *         description: 사용자를 찾을 수 없음
 */
app.delete("/api/users/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
  }
  users.splice(userIndex, 1);
  res.json({ message: "사용자가 삭제되었습니다." });
});

// ==================== 게시글 API ====================

/**
 * @swagger
 * /api/posts:
 *   get:
 *     summary: 모든 게시글 조회
 *     tags: [Posts]
 *     responses:
 *       200:
 *         description: 게시글 목록
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 */
app.get("/api/posts", (req, res) => {
  res.json(posts);
});

/**
 * @swagger
 * /api/posts/{id}:
 *   get:
 *     summary: 특정 게시글 조회
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 게시글 정보
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
app.get("/api/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find((p) => p.id === id);
  if (!post) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }
  res.json(post);
});

/**
 * @swagger
 * /api/posts:
 *   post:
 *     summary: 새 게시글 생성
 *     tags: [Posts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *               - authorId
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               authorId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: 생성된 게시글
 */
app.post("/api/posts", (req, res) => {
  const { title, content, authorId, categoryId } = req.body;
  const newPost = {
    id: posts.length > 0 ? Math.max(...posts.map((p) => p.id)) + 1 : 1,
    title,
    content,
    authorId,
    categoryId: categoryId || 1,
    views: 0,
    likes: 0,
    createdAt: new Date().toISOString().split("T")[0],
  };
  posts.push(newPost);
  res.status(201).json(newPost);
});

/**
 * @swagger
 * /api/posts/{id}:
 *   put:
 *     summary: 게시글 수정
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               categoryId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: 수정된 게시글
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
app.put("/api/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const postIndex = posts.findIndex((p) => p.id === id);
  if (postIndex === -1) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }
  posts[postIndex] = { ...posts[postIndex], ...req.body };
  res.json(posts[postIndex]);
});

/**
 * @swagger
 * /api/posts/{id}:
 *   delete:
 *     summary: 게시글 삭제
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 삭제 성공
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
app.delete("/api/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const postIndex = posts.findIndex((p) => p.id === id);
  if (postIndex === -1) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }
  posts.splice(postIndex, 1);
  comments = comments.filter((c) => c.postId !== id);
  res.json({ message: "게시글이 삭제되었습니다." });
});

/**
 * @swagger
 * /api/posts/search:
 *   get:
 *     summary: 게시글 검색
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: 검색어
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: 카테고리 ID
 *       - in: query
 *         name: authorId
 *         schema:
 *           type: integer
 *         description: 작성자 ID
 *     responses:
 *       200:
 *         description: 검색 결과
 */
app.get("/api/posts/search", (req, res) => {
  const { q, categoryId, authorId } = req.query;
  let results = [...posts];

  if (q) {
    results = results.filter(
      (p) => p.title.includes(q) || p.content.includes(q)
    );
  }
  if (categoryId) {
    results = results.filter((p) => p.categoryId === parseInt(categoryId));
  }
  if (authorId) {
    results = results.filter((p) => p.authorId === parseInt(authorId));
  }

  res.json(results);
});

/**
 * @swagger
 * /api/posts/{id}/like:
 *   post:
 *     summary: 게시글 좋아요
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 좋아요 성공
 *       404:
 *         description: 게시글을 찾을 수 없음
 */
app.post("/api/posts/:id/like", (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find((p) => p.id === id);
  if (!post) {
    return res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }
  post.likes += 1;
  res.json({ likes: post.likes });
});

/**
 * @swagger
 * /api/posts/{id}/views:
 *   post:
 *     summary: 게시글 조회수 증가
 *     tags: [Posts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 조회수 증가 성공
 */
app.post("/api/posts/:id/views", (req, res) => {
  const id = parseInt(req.params.id);
  const post = posts.find((p) => p.id === id);
  if (post) {
    post.views += 1;
    res.json({ views: post.views });
  } else {
    res.status(404).json({ message: "게시글을 찾을 수 없습니다." });
  }
});

// ==================== 댓글 API ====================

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: 모든 댓글 조회
 *     tags: [Comments]
 *     parameters:
 *       - in: query
 *         name: postId
 *         schema:
 *           type: integer
 *         description: 게시글 ID로 필터링
 *     responses:
 *       200:
 *         description: 댓글 목록
 */
app.get("/api/comments", (req, res) => {
  const { postId } = req.query;
  let result = comments;
  if (postId) {
    result = comments.filter((c) => c.postId === parseInt(postId));
  }
  res.json(result);
});

/**
 * @swagger
 * /api/comments/{id}:
 *   get:
 *     summary: 특정 댓글 조회
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 댓글 정보
 */
app.get("/api/comments/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const comment = comments.find((c) => c.id === id);
  if (!comment) {
    return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
  }
  res.json(comment);
});

/**
 * @swagger
 * /api/comments:
 *   post:
 *     summary: 새 댓글 생성
 *     tags: [Comments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - postId
 *               - userId
 *               - content
 *             properties:
 *               postId:
 *                 type: integer
 *               userId:
 *                 type: integer
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: 생성된 댓글
 */
app.post("/api/comments", (req, res) => {
  const { postId, userId, content } = req.body;
  const newComment = {
    id: comments.length > 0 ? Math.max(...comments.map((c) => c.id)) + 1 : 1,
    postId,
    userId,
    content,
    createdAt: new Date().toISOString(),
  };
  comments.push(newComment);
  res.status(201).json(newComment);
});

/**
 * @swagger
 * /api/comments/{id}:
 *   put:
 *     summary: 댓글 수정
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       200:
 *         description: 수정된 댓글
 */
app.put("/api/comments/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const commentIndex = comments.findIndex((c) => c.id === id);
  if (commentIndex === -1) {
    return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
  }
  comments[commentIndex] = { ...comments[commentIndex], ...req.body };
  res.json(comments[commentIndex]);
});

/**
 * @swagger
 * /api/comments/{id}:
 *   delete:
 *     summary: 댓글 삭제
 *     tags: [Comments]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 삭제 성공
 */
app.delete("/api/comments/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const commentIndex = comments.findIndex((c) => c.id === id);
  if (commentIndex === -1) {
    return res.status(404).json({ message: "댓글을 찾을 수 없습니다." });
  }
  comments.splice(commentIndex, 1);
  res.json({ message: "댓글이 삭제되었습니다." });
});

// ==================== 카테고리 API ====================

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: 모든 카테고리 조회
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: 카테고리 목록
 */
app.get("/api/categories", (req, res) => {
  res.json(categories);
});

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     summary: 특정 카테고리 조회
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 카테고리 정보
 */
app.get("/api/categories/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const category = categories.find((c) => c.id === id);
  if (!category) {
    return res.status(404).json({ message: "카테고리를 찾을 수 없습니다." });
  }
  res.json(category);
});

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: 새 카테고리 생성
 *     tags: [Categories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: 생성된 카테고리
 */
app.post("/api/categories", (req, res) => {
  const { name, description } = req.body;
  const newCategory = {
    id:
      categories.length > 0 ? Math.max(...categories.map((c) => c.id)) + 1 : 1,
    name,
    description: description || "",
    postCount: 0,
  };
  categories.push(newCategory);
  res.status(201).json(newCategory);
});

// ==================== 상품 API ====================

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: 모든 상품 조회
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: 카테고리로 필터링
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: integer
 *         description: 최소 가격
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: integer
 *         description: 최대 가격
 *     responses:
 *       200:
 *         description: 상품 목록
 */
app.get("/api/products", (req, res) => {
  const { category, minPrice, maxPrice } = req.query;
  let result = [...products];

  if (category) {
    result = result.filter((p) => p.category === category);
  }
  if (minPrice) {
    result = result.filter((p) => p.price >= parseInt(minPrice));
  }
  if (maxPrice) {
    result = result.filter((p) => p.price <= parseInt(maxPrice));
  }

  res.json(result);
});

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: 특정 상품 조회
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 상품 정보
 */
app.get("/api/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find((p) => p.id === id);
  if (!product) {
    return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
  }
  res.json(product);
});

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: 새 상품 생성
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: integer
 *               category:
 *                 type: string
 *               stock:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: 생성된 상품
 */
app.post("/api/products", (req, res) => {
  const { name, price, category, stock, description } = req.body;
  const newProduct = {
    id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
    name,
    price,
    category,
    stock: stock || 0,
    description: description || "",
  };
  products.push(newProduct);
  res.status(201).json(newProduct);
});

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: 상품 정보 수정
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: integer
 *               stock:
 *                 type: integer
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: 수정된 상품
 */
app.put("/api/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
  }
  products[productIndex] = { ...products[productIndex], ...req.body };
  res.json(products[productIndex]);
});

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: 상품 삭제
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 삭제 성공
 */
app.delete("/api/products/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex((p) => p.id === id);
  if (productIndex === -1) {
    return res.status(404).json({ message: "상품을 찾을 수 없습니다." });
  }
  products.splice(productIndex, 1);
  res.json({ message: "상품이 삭제되었습니다." });
});

// ==================== 통계 API ====================

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: 전체 통계 조회
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: 통계 정보
 */
app.get("/api/stats", (req, res) => {
  res.json({
    totalUsers: users.length,
    totalPosts: posts.length,
    totalComments: comments.length,
    totalProducts: products.length,
    totalCategories: categories.length,
    totalViews: posts.reduce((sum, p) => sum + p.views, 0),
    totalLikes: posts.reduce((sum, p) => sum + p.likes, 0),
  });
});

/**
 * @swagger
 * /api/stats/users:
 *   get:
 *     summary: 사용자 통계
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: 사용자 통계
 */
app.get("/api/stats/users", (req, res) => {
  const usersWithAge = users.filter((u) => u.age);
  const avgAge =
    usersWithAge.length > 0
      ? usersWithAge.reduce((sum, u) => sum + u.age, 0) / usersWithAge.length
      : 0;
  res.json({
    total: users.length,
    averageAge: Math.round(avgAge * 10) / 10,
  });
});

/**
 * @swagger
 * /api/stats/posts:
 *   get:
 *     summary: 게시글 통계
 *     tags: [Statistics]
 *     responses:
 *       200:
 *         description: 게시글 통계
 */
app.get("/api/stats/posts", (req, res) => {
  res.json({
    total: posts.length,
    totalViews: posts.reduce((sum, p) => sum + p.views, 0),
    totalLikes: posts.reduce((sum, p) => sum + p.likes, 0),
    averageViews:
      posts.length > 0
        ? Math.round(
            (posts.reduce((sum, p) => sum + p.views, 0) / posts.length) * 10
          ) / 10
        : 0,
    averageLikes:
      posts.length > 0
        ? Math.round(
            (posts.reduce((sum, p) => sum + p.likes, 0) / posts.length) * 10
          ) / 10
        : 0,
  });
});

// ==================== 인증 API (겉보기용) ====================

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 로그인
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 로그인 성공
 *       401:
 *         description: 인증 실패
 */
app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email);
  if (user) {
    res.json({
      token: "sample-jwt-token-" + Date.now(),
      user: { id: user.id, name: user.name, email: user.email },
    });
  } else {
    res
      .status(401)
      .json({ message: "이메일 또는 비밀번호가 올바르지 않습니다." });
  }
});

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: 현재 사용자 정보 조회
 *     tags: [Auth]
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         schema:
 *           type: string
 *         description: Bearer 토큰
 *     responses:
 *       200:
 *         description: 사용자 정보
 *       401:
 *         description: 인증 필요
 */
app.get("/api/auth/me", (req, res) => {
  if (users.length > 0) {
    res.json({ id: users[0].id, name: users[0].name, email: users[0].email });
  } else {
    res.status(401).json({ message: "인증이 필요합니다." });
  }
});

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 회원가입
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: 회원가입 성공
 */
app.post("/api/auth/register", (req, res) => {
  const { name, email, password } = req.body;
  const newUser = {
    id: users.length > 0 ? Math.max(...users.map((u) => u.id)) + 1 : 1,
    name,
    email,
    age: null,
  };
  users.push(newUser);
  res.status(201).json({
    message: "회원가입이 완료되었습니다.",
    user: { id: newUser.id, name: newUser.name, email: newUser.email },
  });
});

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         age:
 *           type: integer
 *     Post:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         content:
 *           type: string
 *         authorId:
 *           type: integer
 *         categoryId:
 *           type: integer
 *         views:
 *           type: integer
 *         likes:
 *           type: integer
 *         createdAt:
 *           type: string
 *           format: date
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         postId:
 *           type: integer
 *         userId:
 *           type: integer
 *         content:
 *           type: string
 *         createdAt:
 *           type: string
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         postCount:
 *           type: integer
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         price:
 *           type: integer
 *         category:
 *           type: string
 *         stock:
 *           type: integer
 *         description:
 *           type: string
 */

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
  console.log(`Swagger 문서: http://localhost:${PORT}/api-docs`);
});
