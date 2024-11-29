import api from './api';
import { toast } from 'react-toastify';

const TOKEN_KEY = 'authToken';
const USER_KEY = 'userDetails';
const USER_TYPE_KEY = 'userType';

class AuthService {
    setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    }

    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    }

    setUser(user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }

    getUser() {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    }

    setUserType(type) {
        localStorage.setItem(USER_TYPE_KEY, JSON.stringify(type));
    }

    getUserType() {
        const type = localStorage.getItem(USER_TYPE_KEY);
        return type ? JSON.parse(type) : null;
    }

    async login(email, password, userType) {
        try {
            const response = await api.post(`/${userType}/login`, { email, password });
            
            if (response.data.success) {
                const { token, user } = response.data;
                this.setToken(token);
                this.setUser(user);
                this.setUserType(userType);
                return true;
            }
            return false;
        } catch (error) {
            toast.error('Login failed. Please check your credentials.');
            return false;
        }
    }

    logout() {
        localStorage.clear();
        window.location.href = '/login';
    }

    isAuthenticated() {
        return !!this.getToken();
    }
}

export default new AuthService();
