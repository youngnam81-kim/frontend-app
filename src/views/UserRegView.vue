<template>
    <div class="register-container">
        <h2>회원가입</h2>
        <form @submit.prevent="handleRegister" class="register-form">
            <!-- 기본 정보 -->
            <div class="form-group">
                <label for="userId">아이디 *</label>
                <input v-model="user.userId" type="text" id="userId" name="userId" required minlength="3"
                    autocomplete="new-id" maxlength="20" />
                <small v-if="errors.userId" class="error-text">{{ errors.userId }}</small>
            </div>

            <div class="form-group">
                <label for="email">이메일 *</label>
                <input v-model="user.email" type="email" id="email" name="email" required autocomplete="new-email" />
                <small v-if="errors.email" class="error-text">{{ errors.email }}</small>
            </div>

            <div class="form-group">
                <label for="password">비밀번호 *</label>
                <input v-model="user.password" type="password" id="password" name="password" required minlength="4"
                    autocomplete="new-password" />
                <small v-if="errors.password" class="error-text">{{ errors.password }}</small>
            </div>

            <div class="form-group">
                <label for="confirmPassword">비밀번호 확인 *</label>
                <input v-model="user.confirmPassword" type="password" id="confirmPassword" name="confirmPassword"
                    autocomplete="new-password" required />
                <small v-if="errors.confirmPassword" class="error-text">{{ errors.confirmPassword }}</small>
            </div>

            <!-- 추가 정보 -->
            <div class="form-group">
                <label for="userName">이름</label>
                <input v-model="user.userName" type="text" id="userName" name="userName" />
            </div>

            <div class="form-group">
                <label for="phoneNumber">전화번호</label>
                <input v-model="user.phoneNumber" type="tel" id="phoneNumber" name="phoneNumber"
                    placeholder="010-0000-0000" />
            </div>

            <div class="form-group">
                <label for="birthDate">생년월일</label>
                <input v-model="user.birthDate" type="date" id="birthDate" name="birthDate" />
            </div>

            <!-- 약관 동의 -->
            <div class="form-group checkbox-group">
                <input v-model="user.agreement" type="checkbox" id="agreement" name="agreement" required />
                <label for="agreement">서비스 이용약관 동의 (필수) *</label>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn btn-primary">회원가입</button>
                <button type="button" class="btn btn-secondary" @click="goToLogin">로그인 페이지로</button>
            </div>

            <div v-if="message" :class="['message', messageType]">
                {{ message }}
            </div>
        </form>
    </div>
</template>

<script>
export default {
    data() {
        return {
            user: {
                userName: '',
                email: '',
                password: '',
                confirmPassword: '',
                userId: '',
                phoneNumber: '',
                birthDate: null,
                agreement: false
            },
            errors: {
                userId: '',
                email: '',
                password: '',
                confirmPassword: ''
            },
            message: '',
            messageType: 'info'
        };
    },
    methods: {
        validateForm() {
            let isValid = true;
            this.errors = {
                userName: '',
                email: '',
                password: '',
                confirmPassword: ''
            };

            // 아이디 검증
            if (this.user.userId.length < 3) {
                this.errors.userId = '아이디는 최소 3자 이상이어야 합니다.';
                isValid = false;
            }

            // 이메일 검증
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.user.email)) {
                this.errors.email = '유효한 이메일 주소를 입력해주세요.';
                isValid = false;
            }

            // 비밀번호 검증
            if (this.user.password.length < 4) {
                this.errors.password = '비밀번호는 최소 4자 이상이어야 합니다.';
                isValid = false;
            }

            // 비밀번호 확인
            if (this.user.password !== this.user.confirmPassword) {
                this.errors.confirmPassword = '비밀번호가 일치하지 않습니다.';
                isValid = false;
            }

            return isValid;
        },
        async handleRegister() {
            if (!this.validateForm()) {
                return;
            }

            if (!this.user.agreement) {
                this.message = '서비스 이용약관에 동의해주세요.';
                this.messageType = 'error';
                return;
            }

            try {
                // 비밀번호 확인 필드는 서버로 전송하지 않음
                const { confirmPassword, ...userData } = this.user;

                const response = await this.$axios.post('/api/users', userData);

                this.message = '회원가입이 성공적으로 완료되었습니다.';
                this.messageType = 'success';

                // 3초 후 로그인 페이지로 이동
                setTimeout(() => {
                    this.$router.push('/login');
                }, 3000);

            } catch (error) {
                console.error('회원가입 오류:', error);

                if (error.response) {
                    // 서버에서 응답이 왔지만 오류가 있는 경우
                    this.message = error.response.data.message || '회원가입 처리 중 오류가 발생했습니다.';
                } else {
                    // 서버에 요청이 도달하지 못한 경우
                    this.message = '서버와 통신 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.';
                }
                this.messageType = 'error';
            }
        }
    }
}
</script>

<style scoped>
.register-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
}

.register-form {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    margin-bottom: 5px;
    font-weight: 500;
}

.form-group input {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.checkbox-group {
    flex-direction: row;
    align-items: center;
    gap: 10px;
}

.checkbox-group input {
    width: auto;
}

.error-text {
    color: #ff4d4f;
    font-size: 12px;
    margin-top: 4px;
}

.form-actions {
    display: flex;
    gap: 10px;
    margin-top: 10px;
}

.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
}

.btn-primary {
    background-color: #1890ff;
    color: white;
}

.btn-secondary {
    background-color: #f0f0f0;
    color: #333;
}

.message {
    margin-top: 15px;
    padding: 10px;
    border-radius: 4px;
}

.success {
    background-color: #f6ffed;
    border: 1px solid #b7eb8f;
    color: #52c41a;
}

.error {
    background-color: #fff2f0;
    border: 1px solid #ffccc7;
    color: #ff4d4f;
}

.info {
    background-color: #e6f7ff;
    border: 1px solid #91d5ff;
    color: #1890ff;
}
</style>