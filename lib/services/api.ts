// services/api.ts
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_FASTAPI_URL || 'http://localhost:8000';

export const analyzePlanogram = async (storeId: string, planogramData: any, imageFile: File) => {
    const formData = new FormData();
    formData.append('store_id', storeId);
    formData.append('planograma', JSON.stringify(planogramData));
    formData.append('image', imageFile);

    try {
        const response = await axios.post(`${API_URL}/analyze-shelf/`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error analyzing planogram:', error);
        throw error;
    }
};