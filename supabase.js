// =====================================================
// PROFAYCEL — Supabase Configuration
// =====================================================

const SUPABASE_URL = "https://hlwuqvbrnluxtxsaiehp.supabase.co";
const SUPABASE_KEY = "sb_publishable_PLdPtzyRgQ2Kc-x0lPVLoQ_NgCSuj47";

// نستعملوا window باش يكون متاح في كل الملفات
window.supabaseClient = null;

function initSupabase() {

    if (typeof window.supabase === "undefined") {
        console.warn("Supabase JS non chargé.");
        return;
    }

    window.supabaseClient = window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );

    console.log("Supabase connecté !");

}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSupabase);
} else {
    initSupabase();
}