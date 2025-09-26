<template>
    <div class="login-container">
        <h2>로그인</h2>
        <form @submit.prevent="handleLogin" class="login-form">
            <div class="form-group">
                <label for="userId">아이디</label>
                <input v-model="userId" type="text" id="userId" name="userId" required autocomplete="userId" />
            </div>

            <div class="form-group">
                <label for="password">비밀번호</label>
                <input v-model="password" type="password" id="password" name="password" required
                    autocomplete="current-password" />
            </div>

            <!-- <div class="form-options">
                <label class="remember-me">
                    <input type="checkbox" v-model="rememberMe" />
                    <span>아이디 저장</span>
                </label>
                <router-link to="/forgot-password" class="forgot-password">비밀번호 찾기</router-link>
            </div> -->

            <div class="form-actions">
                <button type="submit" class="btn-login" :disabled="isLoading">
                    {{ isLoading ? '로그인 중...' : '로그인' }}
                </button>
            </div>

            <div v-if="errorMessage" class="error-message">
                {{ errorMessage }}
            </div>
        </form>

        <div class="register-link">
            계정이 없으신가요? <router-link to="/userReg">회원가입</router-link>
        </div>
    </div>
</template>

<script>
export default {
    // 컴포넌트의 데이터 정의
    data() {
        return {
            userId: '',
            password: '',
            rememberMe: false, // 아이디 저장 여부
            errorMessage: '',  // 오류 메시지
            isLoading: false   // 로딩 상태
        };
    },
    // 컴포넌트가 마운트된 후 실행될 로직 (Options API의 라이프사이클 훅)
    mounted() {
        // 로컬 스토리지에서 저장된 아이디 불러오기
        if (localStorage.getItem('rememberedUserId')) {
            this.userId = localStorage.getItem('rememberedUserId');
            this.rememberMe = true; // 아이디가 저장되어 있으면 '아이디 저장' 체크
        }
    },
    // 컴포넌트의 메서드 정의
    methods: {
        // 로그인 처리 메서드
        async handleLogin() {
            try {
                this.errorMessage = ''; // 이전 오류 메시지 초기화
                this.isLoading = true;  // 로딩 상태 시작

                // '아이디 저장' 체크 여부에 따라 로컬 스토리지에 저장 또는 제거
                if (this.rememberMe) {
                    localStorage.setItem('rememberedUserId', this.userId);
                } else {
                    localStorage.removeItem('rememberedUserId');
                }

                // 백엔드 API로 로그인 요청 (POST 요청)
                const response = await this.$axios.post('/api/users/login', {
                    userId: this.userId,
                    password: this.password
                });

                // 로그인 성공 처리
                const { token, user } = response.data; // 서버 응답에서 토큰과 사용자 정보 추출

                // 토큰 저장 (예: 로컬 스토리지에 JWT 토큰 저장)
                localStorage.setItem('token', token);

                // 사용자 정보 저장 또는 상태 관리 (예: Vuex/Pinia 스토어 사용)
                // this.$store.commit('setUser', user); // Vuex 예시

                // 로그인 성공 후 메인 페이지 또는 대시보드로 이동
                // this.$router를 통해 라우터 인스턴스에 접근합니다.
                alert('로그인 완료');
                this.$router.push('/');

            } catch (error) {
                console.error('로그인 오류:', error);

                // 서버 응답 오류 메시지 처리
                if (error.response && error.response.data && error.response.data.message) {
                    this.errorMessage = error.response.data.message;
                } else {
                    this.errorMessage = '로그인 중 오류가 발생했습니다. 다시 시도해주세요.';
                }
            } finally {
                this.isLoading = false; // 로딩 상태 종료
            }
        }
    }
};
</script>

<style scoped>
/* 이전 답변에서 제공된 스타일과 동일합니다. */
.login-container {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #ffffff;
}

h2 {
    text-align: center;
    color: #333;
    margin-bottom: 25px;
}

.login-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-weight: 600;
    color: #555;
    font-size: 15px;
}

.form-group input {
    padding: 10px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 16px;
    transition: border-color 0.3s;
}

.form-group input:focus {
    border-color: #4a90e2;
    outline: none;
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
}

.remember-me {
    display: flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;
    color: #555;
}

.remember-me input[type="checkbox"] {
    transform: scale(1.1);
    margin-right: 5px;
}

.forgot-password {
    color: #4a90e2;
    text-decoration: none;
    transition: color 0.3s;
}

.forgot-password:hover {
    text-decoration: underline;
    color: #357abf;
}

.form-actions {
    margin-top: 10px;
}

.btn-login {
    background-color: #4a90e2;
    color: white;
    padding: 12px 15px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    font-size: 17px;
    width: 100%;
    transition: background-color 0.3s;
}

.btn-login:hover:not(:disabled) {
    background-color: #357abf;
}

.btn-login:disabled {
    background-color: #a0c4e9;
    cursor: not-allowed;
}

.error-message {
    color: #e74c3c;
    font-size: 14px;
    text-align: center;
    margin-top: 15px;
    padding: 10px;
    background-color: #ffe0e0;
    border-radius: 4px;
    border: 1px solid #e74c3c;
}

.register-link {
    text-align: center;
    margin-top: 25px;
    font-size: 15px;
    color: #555;
}

.register-link a {
    color: #4a90e2;
    text-decoration: none;
    font-weight: 600;
}

.register-link a:hover {
    text-decoration: underline;
    color: #357abf;
}
</style>