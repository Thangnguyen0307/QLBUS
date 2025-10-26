const axios = require("axios");

/**
 * Lấy tọa độ (lat, lon) từ địa chỉ bằng Nominatim (OpenStreetMap)
 * @param {string} address - địa chỉ cần tìm
 * @returns {Promise<{ lat: number, lon: number } | null>}
 */
async function getCoordinates(address) {
  try {
    const res = await axios.get("https://nominatim.openstreetmap.org/search", {
      params: { q: address, format: "json", limit: 1 },
      headers: { "User-Agent": "SchoolBusApp/1.0" },
    });

    if (res.data && res.data.length > 0) {
      const { lat, lon } = res.data[0];
      return { lat: parseFloat(lat), lon: parseFloat(lon) };
    }
    return null;
  } catch (err) {
    console.error("❌ Lỗi khi gọi Nominatim:", err.message);
    return null;
  }
}

module.exports = { getCoordinates };
