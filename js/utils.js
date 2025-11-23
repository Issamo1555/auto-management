/**
 * Utility Functions
 */

const Utils = {
    /**
     * Compress an image file to a Base64 string with max dimensions and quality.
     * @param {File} file - The image file to compress.
     * @param {number} maxWidth - Maximum width in pixels (default 800).
     * @param {number} quality - JPEG quality from 0 to 1 (default 0.7).
     * @returns {Promise<string>} - Resolves with Base64 string.
     */
    compressImage: (file, maxWidth = 800, quality = 0.7) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;

                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width);
                        width = maxWidth;
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);

                    const dataUrl = canvas.toDataURL('image/jpeg', quality);
                    resolve(dataUrl);
                };
                img.onerror = (err) => reject(err);
            };
            reader.onerror = (err) => reject(err);
        });
    }
};

window.Utils = Utils;
