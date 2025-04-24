import { storage } from './config';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export const uploadFile = async (uri, path) => {
    const blob = await fetch(uri).then(res => res.blob());
    const fileRef = ref(storage, path);
    await uploadBytes(fileRef, blob);
    return await getDownloadURL(fileRef);
};
