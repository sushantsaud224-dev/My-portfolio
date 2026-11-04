import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabase = createClient(
  "YOUR_SUPABASE_PROJECT_URL",
  "YOUR_SUPABASE_ANON_KEY"
);

const gallery = document.querySelector("#portfolioGallery");

const { data: items, error } = await supabase
  .from("media")
  .select("title,description,kind,category,school,event_day,storage_path,created_at")
  .order("created_at", { ascending: false });

if (error) {
  gallery.textContent = "Gallery is temporarily unavailable.";
} else {
  for (const item of items) {
    const { data } = supabase.storage
      .from("portfolio-media")
      .getPublicUrl(item.storage_path);

    const card = document.createElement("article");
    card.className = "gallery-card";

    const media = item.kind === "video"
      ? document.createElement("video")
      : document.createElement("img");

    media.src = data.publicUrl;
    media.controls = item.kind === "video";
    media.loading = "lazy";
    media.alt = item.kind === "photo" ? item.title : "";
    if (item.kind === "video") media.playsInline = true;

    const caption = document.createElement("div");
    caption.className = "gallery-caption";

    const title = document.createElement("strong");
    title.textContent = item.title;

    const details = document.createElement("span");
    details.textContent = [item.category, item.school, item.event_day]
      .filter(Boolean)
      .join(" · ");

    caption.append(title, details);
    if (item.description) {
      const description = document.createElement("p");
      description.textContent = item.description;
      caption.append(description);
    }

    card.append(media, caption);
    gallery.append(card);
  }
}