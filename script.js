document.addEventListener("DOMContentLoaded", () => {
    const removeBgButton = document.getElementById("removeBgButton");
    const cancelButton = document.getElementById("cancelButton");
    const imageInput = document.getElementById("imageInput");
    const imageOutput = document.getElementById("imageOutput");
    const errorMessage = document.getElementById("errorMessage");
    const loading = document.getElementById("loading");
    const beforePlaceholder = document.getElementById("beforePlaceholder");
    const placeholderText = document.getElementById("placeholderText");

    let isProcessing = false; // Menyimpan status proses

    // Fungsi untuk memulai proses penghapusan background
    const removeBackground = async () => {
        if (!imageInput.files[0]) {
            errorMessage.textContent = "Upload foto terlebih dahulu";
            errorMessage.classList.remove("hidden");
            return;
        }

        errorMessage.classList.add("hidden"); 
        const formData = new FormData();
        formData.append("image_file", imageInput.files[0]);

        // Tampilkan loading spinner
        loading.classList.remove("hidden");
        isProcessing = true;

        try {
            placeholderText.textContent = "Proses...";
            const response = await fetch("https://api.remove.bg/v1.0/removebg", {
                method: "POST",
                headers: {
                    "X-Api-Key": "f6nuWkRiVU7pwEKakZVaYm1X",
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error("Gagal menghapus latar belakang");
            }

            const blob = await response.blob();
            const imageUrl = URL.createObjectURL(blob);

            // Tampilkan gambar asli
            const fileReader = new FileReader();
            fileReader.onload = () => {
                const beforeImage = document.createElement("img");
                beforeImage.src = fileReader.result;
                beforePlaceholder.innerHTML = "";
                beforePlaceholder.appendChild(beforeImage);
            };
            fileReader.readAsDataURL(imageInput.files[0]);

            // Tampilkan gambar hasil dan tombol Download
            imageOutput.innerHTML = `
                <img src="${imageUrl}" alt="Processed Image" class="max-w-full h-auto w-full rounded-lg shadow mb-4" />
                <a href="${imageUrl}" download="Bgremover-image.png" class="bg-transparent absolute top-4 right-4 text-white px-4 py-2 rounded-lg">
                <i class="ri-file-download-line text-black text-xl text-end"></i>
                </a>
            `;
        } catch (error) {
            console.error(error);
            placeholderText.textContent = "Terjadi kesalahan saat memproses gambar.";
        } finally {
            loading.classList.add("hidden");
            isProcessing = false;
        }
    };

    // Event listener untuk tombol Remove
    removeBgButton.addEventListener("click", removeBackground);

    // Event listener untuk tombol Cancel
    cancelButton.addEventListener("click", () => {
        if (isProcessing) {
            isProcessing = false;
            loading.classList.add("hidden");
            alert("Proses penghapusan latar belakang dibatalkan.");
        } else {
            alert("Tidak ada proses yang berjalan.");
        }
    });
});
