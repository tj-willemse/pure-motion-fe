import { permanentRedirect } from "next/navigation";

export default function TeamRedirectPage() {
  permanentRedirect("/coaches");
}
