var GLOBAL_CONFIG = {
  API_URL: "",
  UPLOAD: ""
};

//Nhận 1 trong các giá trị sau: local | test | production
var environment = "test";

if (environment == "test") {
  GLOBAL_CONFIG.API_URL = "https://reach-api.demo.siten.vn/mis-api/";
  GLOBAL_CONFIG.UPLOAD = "https://reach-api.demo.siten.vn/";
} else if (environment == "production") {
  GLOBAL_CONFIG.API_URL = "https://reach-api.demo.siten.vn/mis-api/";
  GLOBAL_CONFIG.UPLOAD = "https://reach-api.demo.siten.vn/";
} else if (environment == "local") {
  GLOBAL_CONFIG.API_URL = "https://localhost:44329/mis-api/";
  GLOBAL_CONFIG.UPLOAD = "https://localhost:44329/";
}
