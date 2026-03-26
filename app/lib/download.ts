import api from "./axios";

export const downloadFile = async (url: string, filename: string, params: any = {}) => {
    try {
        const response = await api.get(url, {
            params,
            responseType: 'blob',
        });

        const blob = new Blob([response.data], {
            type: response.headers['content-type']
        });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
    } catch (error) {
        console.error("Download failed", error);
        throw error;
    }
};
