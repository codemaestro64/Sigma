import axios from 'axios';

const pinataJWT = process.env.NEXT_PUBLIC_PINATA_JWT;

export const pinata = {
  pinJSONToIPFS: async (jsonBody: any) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
    const response = await axios.post(url, jsonBody, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${pinataJWT}`,
      },
    });
    return response.data;
  },

  pinFileToIPFS: async (file: File) => {
    const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${pinataJWT}`,
      },
    });
    return response.data;
  },
};
