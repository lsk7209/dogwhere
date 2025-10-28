-- D1 데이터베이스 스키마
-- 클라우드플레어 D1용 SQLite 스키마

-- 장소 테이블
CREATE TABLE IF NOT EXISTS places (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT,
  description TEXT,
  short_description TEXT,
  
  -- 위치 정보
  address TEXT NOT NULL,
  sido TEXT NOT NULL,
  sigungu TEXT NOT NULL,
  dong TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  postal_code TEXT,
  
  -- 연락처 정보
  phone TEXT,
  website TEXT,
  instagram TEXT,
  kakao TEXT,
  
  -- 운영 정보 (JSON 형태로 저장)
  operating_hours TEXT, -- JSON string
  closed_days TEXT, -- JSON string
  last_order TEXT,
  break_time TEXT,
  
  -- 강아지 관련 정보
  pet_allowed BOOLEAN DEFAULT 1,
  pet_size_restriction TEXT DEFAULT 'all',
  pet_additional_fee INTEGER DEFAULT 0,
  pet_requirements TEXT, -- JSON string
  pet_facilities TEXT, -- JSON string
  
  -- 편의시설 (JSON 형태로 저장)
  amenities TEXT, -- JSON string
  
  -- 가격 정보
  price_range TEXT DEFAULT 'medium',
  average_price INTEGER,
  currency TEXT DEFAULT 'KRW',
  additional_fees TEXT, -- JSON string
  
  -- 평점 및 리뷰
  overall_rating REAL DEFAULT 0,
  pet_friendly_rating REAL DEFAULT 0,
  service_rating REAL DEFAULT 0,
  atmosphere_rating REAL DEFAULT 0,
  value_rating REAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  
  -- 이미지
  main_image TEXT,
  gallery_images TEXT, -- JSON string
  thumbnail_image TEXT,
  
  -- 메타데이터
  verified BOOLEAN DEFAULT 0,
  featured BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_verified DATETIME,
  source TEXT DEFAULT 'manual',
  
  -- SEO 정보
  seo_title TEXT,
  seo_description TEXT,
  seo_keywords TEXT, -- JSON string
  canonical_url TEXT
);

-- 리뷰 테이블
CREATE TABLE IF NOT EXISTS reviews (
  id TEXT PRIMARY KEY,
  place_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  user_name TEXT NOT NULL,
  user_avatar TEXT,
  
  -- 평점
  overall_rating INTEGER NOT NULL,
  pet_friendly_rating INTEGER NOT NULL,
  service_rating INTEGER NOT NULL,
  atmosphere_rating INTEGER NOT NULL,
  value_rating INTEGER NOT NULL,
  
  -- 리뷰 내용
  content TEXT NOT NULL,
  images TEXT, -- JSON string
  
  -- 메타데이터
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  verified BOOLEAN DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,
  report_count INTEGER DEFAULT 0,
  
  FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE
);

-- 지역 정보 테이블
CREATE TABLE IF NOT EXISTS regions (
  code TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'sido', 'sigungu', 'dong'
  parent_code TEXT,
  latitude REAL,
  longitude REAL,
  bounds TEXT -- JSON string
);

-- 이벤트 테이블
CREATE TABLE IF NOT EXISTS events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  
  -- 위치 정보
  venue_name TEXT,
  address TEXT,
  sido TEXT,
  sigungu TEXT,
  latitude REAL,
  longitude REAL,
  
  -- 이벤트 정보
  start_date DATETIME NOT NULL,
  end_date DATETIME,
  start_time TEXT,
  end_time TEXT,
  event_type TEXT, -- 'festival', 'market', 'competition', 'education'
  
  -- 강아지 관련
  pet_friendly BOOLEAN DEFAULT 1,
  pet_requirements TEXT, -- JSON string
  
  -- 연락처
  organizer TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  
  -- 이미지
  main_image TEXT,
  gallery_images TEXT, -- JSON string
  
  -- 메타데이터
  featured BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  source TEXT DEFAULT 'manual'
);

-- 블로그 포스트 테이블
CREATE TABLE IF NOT EXISTS posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  date TEXT NOT NULL,
  category TEXT NOT NULL,
  read_time TEXT,
  
  -- 이미지
  image TEXT,
  
  -- 태그 및 메타데이터
  tags TEXT, -- JSON string
  location TEXT,
  last_modified TEXT,
  seo_keywords TEXT, -- JSON string
  
  -- 지리적 위치
  geo_latitude REAL,
  geo_longitude REAL,
  geo_address TEXT,
  
  -- 메타데이터
  featured BOOLEAN DEFAULT 0,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 추천 테이블
CREATE TABLE IF NOT EXISTS recommendations (
  id TEXT PRIMARY KEY,
  place_id TEXT,
  event_id TEXT,
  post_id TEXT,
  type TEXT NOT NULL, -- 'place', 'event', 'post'
  title TEXT NOT NULL,
  description TEXT,
  image TEXT,
  priority INTEGER DEFAULT 0,
  start_date DATETIME,
  end_date DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  
  FOREIGN KEY (place_id) REFERENCES places(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE
);

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_places_sido ON places(sido);
CREATE INDEX IF NOT EXISTS idx_places_sigungu ON places(sigungu);
CREATE INDEX IF NOT EXISTS idx_places_category ON places(category);
CREATE INDEX IF NOT EXISTS idx_places_rating ON places(overall_rating);
CREATE INDEX IF NOT EXISTS idx_places_verified ON places(verified);
CREATE INDEX IF NOT EXISTS idx_places_featured ON places(featured);
CREATE INDEX IF NOT EXISTS idx_places_location ON places(latitude, longitude);

CREATE INDEX IF NOT EXISTS idx_reviews_place_id ON reviews(place_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(overall_rating);

CREATE INDEX IF NOT EXISTS idx_events_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_featured ON events(featured);

CREATE INDEX IF NOT EXISTS idx_posts_category ON posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_date ON posts(date);
CREATE INDEX IF NOT EXISTS idx_posts_featured ON posts(featured);

CREATE INDEX IF NOT EXISTS idx_recommendations_type ON recommendations(type);
CREATE INDEX IF NOT EXISTS idx_recommendations_priority ON recommendations(priority);
CREATE INDEX IF NOT EXISTS idx_recommendations_date ON recommendations(start_date);

-- 샘플 데이터 삽입
INSERT OR IGNORE INTO places (
  id, name, slug, category, description, short_description,
  address, sido, sigungu, latitude, longitude,
  phone, website, overall_rating, review_count,
  main_image, verified, featured, created_at
) VALUES (
  'place-001',
  '멍멍카페 강남점',
  'meong-meong-cafe-gangnam',
  'cafe',
  '강남구에서 가장 인기 있는 강아지 동반 카페입니다. 넓은 실내 공간과 강아지 전용 놀이터를 갖추고 있어 강아지와 함께 편안하게 시간을 보낼 수 있습니다.',
  '강아지와 함께하는 특별한 카페 시간',
  '서울특별시 강남구 테헤란로 123',
  '서울특별시',
  '강남구',
  37.5172,
  127.0473,
  '02-1234-5678',
  'https://meongmeongcafe.com',
  4.8,
  127,
  'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  1,
  1,
  '2024-01-15T00:00:00Z'
);

INSERT OR IGNORE INTO places (
  id, name, slug, category, description, short_description,
  address, sido, sigungu, latitude, longitude,
  phone, website, overall_rating, review_count,
  main_image, verified, featured, created_at
) VALUES (
  'place-002',
  '제주 펫프렌들리 리조트',
  'jeju-pet-friendly-resort',
  'accommodation',
  '제주도 서귀포시에 위치한 강아지 동반 전용 리조트입니다. 바다 전망과 강아지 전용 놀이터를 갖추고 있어 강아지와 함께하는 특별한 휴가를 즐길 수 있습니다.',
  '제주도 바다 전망 펫프렌들리 리조트',
  '제주특별자치도 서귀포시 중문관광단지 123',
  '제주특별자치도',
  '서귀포시',
  33.2398,
  126.4123,
  '064-123-4567',
  'https://jejupetresort.com',
  4.9,
  89,
  'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  1,
  1,
  '2024-02-01T00:00:00Z'
);
