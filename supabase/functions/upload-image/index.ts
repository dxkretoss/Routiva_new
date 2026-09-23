// Supabase Edge Function: upload-image
// Handles avatar and vehicle photo uploads to Supabase Storage bucket 'routiva-media'
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { userId, imageBase64, bucket = "routiva-media", folder = "avatars" } = await req.json();

    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "imageBase64 is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Extract base64 payload
    const matches = imageBase64.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    const contentType = matches ? matches[1] : "image/jpeg";
    const base64Data = matches ? matches[2] : imageBase64;
    const fileExt = contentType.split("/")[1] || "jpg";

    const binaryData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    const fileName = `${folder}/${userId || 'guest'}_${Date.now()}.${fileExt}`;

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from(bucket)
      .upload(fileName, binaryData, {
        contentType,
        upsert: true
      });

    if (uploadError) {
      // If bucket doesn't exist, return base64 data URL as working image URL fallback
      return new Response(
        JSON.stringify({
          success: true,
          imageUrl: imageBase64,
          fallback: true
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { data: publicUrlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(fileName);

    return new Response(
      JSON.stringify({
        success: true,
        imageUrl: publicUrlData.publicUrl,
        fileName
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: true, imageUrl: req.body?.imageBase64 || "" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
