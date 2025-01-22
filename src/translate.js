load("language_list.js");

function execute(text, from, to, apiKey) {
    return translateContent(text, from, to, apiKey, 0);
}

function translateContent(text, from, to, apiKey, retryCount) {
    if (retryCount > 2) {
        console.error("Đã vượt quá số lần thử lại.");
        return null;
    }

    const data = {
        text: text, // Văn bản cần dịch
        source_language: from || "auto", // Ngôn ngữ nguồn, "auto" nếu muốn phát hiện tự động
        target_language: to, // Ngôn ngữ đích
    };

    let response;
    try {
        response = fetch("https://api.gemini-ai.com/translate", { // Thay URL bằng endpoint của Gemini
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`, // Thêm API Key vào header
            },
            body: JSON.stringify(data), // Chuyển payload thành chuỗi JSON
        });
    } catch (error) {
        console.error("Lỗi kết nối API Gemini:", error.message);
        return null;
    }

    if (response.ok) {
        const result = response.json(); // Giả sử kết quả trả về là JSON
        if (result && result.translation) {
            return Response.success(result.translation); // Trả về bản dịch từ API Gemini
        } else {
            console.error("API không trả về dữ liệu mong muốn:", result);
        }
    } else {
        console.error(`Lỗi dịch thuật (Gemini): ${response.status} - ${response.statusText}`);
    }

    console.warn("Thử lại lần nữa...");
    return translateContent(text, from, to, apiKey, retryCount + 1); // Thử lại nếu thất bại
}
