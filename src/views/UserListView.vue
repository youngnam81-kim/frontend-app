<template>
    <div>
        <h2>사용자 목록</h2>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>USER ID</th>
                    <th>이름</th>
                    <th>권한</th>
                    <th>수정</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="user in users" :key="user.id">
                    <td>{{ user.id }}</td>
                    <td>{{ user.userId }}</td>
                    <td>{{ user.userName }}</td>
                    <td>{{ user.auth }}</td>
                    <td><button @click="modifyUser(user.id)">수정</button></td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            users: []
        }
    },
    mounted() {
        // API에서 사용자 데이터 가져오기
        this.getUsers();
    },
    methods: {
        async getUsers() { // async/await 패턴을 사용하여 가독성을 높일 수 있습니다.
            try {
                // 백엔드 API 엔드포인트에 GET 요청
                const response = await this.$axios.get('/api/users');
                this.users = response.data; // axios는 응답 데이터를 `response.data`로 제공합니다.
            } catch (error) {
                console.error('사용자 데이터를 가져오는 중 오류 발생:', error);
                // 오류 처리 로직 (예: 사용자에게 메시지 표시)
            }
        },
        modifyUser(id) {
            this.$router.push(`/userReg/${id}`);
        }
    }
}
</script>


<style scoped>
/* 테이블 기본 스타일 (예시) */
table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}
</style>