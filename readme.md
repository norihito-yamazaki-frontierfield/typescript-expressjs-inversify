

1. コンテナ立ち上げ
```bash
cd docker
docker-compose up
```

2. http://localhost:8080/admin にアクセス
   1. Create realm
      1. Realm name : `local-realm`
   2. 作成したrealmを選択する
   3. users
      1. create user
         1. local-user-1
            1. UserName : `local-user-1`
            2. Password : `password`
            3. Email verified : `Yes`
         1. local-user-2
            1. UserName : `local-user-2`
            2. Password : `password`
            3. Email verified : `Yes`
   4. Create client
      1. Client ID: `local-client`
      2. Valid redirect URIs: `http://localhost:8080/*`
      3. Valid post logout redirect URIs : `http://localhost:8080/*`
      4. Web origins: 
         1. `http://localhost:8080`
         2. `http://localhost:3000`
      5. Client authentication: `ON`
      6. Valid redirect URIs: `http://localhost:8080/*`

3. create DB & Table
```sql
CREATE DATABASE my_custom_db;
USE my_custom_db;

CREATE USER 'local-db-user'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON my_custom_db.* TO 'local-db-user'@'%';
FLUSH PRIVILEGES;

FLUSH PRIVILEGES;

FLUSH PRIVILEGES;

CREATE TABLE companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    UNIQUE KEY unique_company_name (name)
);

CREATE TABLE offices (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    UNIQUE KEY unique_office_name_per_company (company_id, name),
    FOREIGN KEY (company_id) REFERENCES companies(id)
);

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    keycloak_user_id VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    company_id INT,
    office_id INT,
    UNIQUE KEY unique_keycloak_user_id (keycloak_user_id),
    FOREIGN KEY (company_id) REFERENCES companies(id),
    FOREIGN KEY (office_id) REFERENCES offices(id)
);

INSERT INTO companies (name) VALUES ('Company A'), ('Company B');
INSERT INTO offices (company_id, name) VALUES (1, 'Office 1'), (2, 'Office 2');

-- keycloak_user_idには、KeyCloackのuserinfo APIから取得したsubの値を設定してください。
INSERT INTO users (keycloak_user_id, name, email, company_id, office_id) 
VALUES 
('ec04c490-a4d0-498a-816a-bc0c116f5a40', 'User 1', 'user1@example.com', 1, 1),
('961e3175-89bf-460d-8de3-cf0b4c5bfc08', 'User 2', 'user2@example.com', 2, 2);
```




### コンテナ削除

```bash
# コンテナとネットワークの削除:
docker-compose down
# ボリュームの削除:
docker-compose down -v

```