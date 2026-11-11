const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * Fetch active career openings for public visitors
 */
export async function getPublicCareerOpenings() {
  try {
    const res = await fetch(`${API_URL}/careers`);
    if (!res.ok) {
      throw new Error(`Failed to fetch careers: ${res.status}`);
    }
    const data = await res.json();
    return data;
  } catch (err) {
    console.warn("Public career fetch error (using fallback):", err);
    return { success: false, data: [] };
  }
}

