# vue-kerberos

# 簡介

[vue-kerberos](https://github.com/wsd53pa01/vue-kerberos) 是一個純前端專案，簡單的實現，從新增應用程式 → 設定群組 → 設定角色 → 設定功能 → 設定權限，目的是讓 Developer 設定好功能，由 User 自行設定權限，並管理角色、群組，再透過系統提供的 API，存取目標系統使用者的權限。

- UI：Element UI

- JavaScript Framework：Vue.js. Version：2.0 

- 範本：[vue-admin-template](https://github.com/PanJiaChen/vue-admin-template)

- 參考：[vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)

# 使用

```bash
npm install 
npm run dev:mock
```

# 功能

```
- Login / Logout

- 應用程式看板
  - 新增應用程式
  - 點選管理功能

- 功能管理
  - 設定功能
  - 設定操作功能

- 角色管理
  - 設定角色跟群組的對應

- 權限管理
  - 每個角色的功能，可以使用那些操作的權限。

- 群組管理
  - 將使用者來源加入到，應用程式的群組。

- 後臺管理
  - 組織設定
    - 設定多個組織的使用者來源。
  - 操作功能範本設定
    - 設定功能的操作功能的範本
```
