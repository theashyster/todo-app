import { io } from 'socket.io-client';
import { BASE_URL, PROD_URL } from '../utils/constants';

const URL = process.env.NODE_ENV === 'production' ? PROD_URL : BASE_URL;

export const socket = io(URL);
