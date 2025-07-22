import { component$, useSignal } from "@builder.io/qwik";
import { useLocation } from "@builder.io/qwik-city";
import { DebugSection } from "~/components/common";

export default component$(() => {
  const location = useLocation();
  const token = location.url.searchParams.get("token") || "";
  const debugInfo = useSignal({
    fullUrl: location.url.href,
    pathname: location.url.pathname,
    search: location.url.search,
    allParams: Object.fromEntries(location.url.searchParams.entries()),
    token: token,
    tokenLength: token.length,
    isEmpty: !token,
  });

  return (
    <div class="container mx-auto p-8">
      <h1 class="text-2xl font-bold mb-6">🔍 Debug Reset Password Token</h1>

      <DebugSection title="URL Information">
        <div class="space-y-2 text-sm">
          <div>
            <strong>Full URL:</strong>{" "}
            <code class="bg-base-300 px-2 py-1 rounded">
              {debugInfo.value.fullUrl}
            </code>
          </div>
          <div>
            <strong>Pathname:</strong>{" "}
            <code class="bg-base-300 px-2 py-1 rounded">
              {debugInfo.value.pathname}
            </code>
          </div>
          <div>
            <strong>Search:</strong>{" "}
            <code class="bg-base-300 px-2 py-1 rounded">
              {debugInfo.value.search}
            </code>
          </div>
        </div>
      </DebugSection>

      <DebugSection title="Token Information">
        <div class="space-y-2 text-sm">
          <div>
            <strong>Token:</strong>{" "}
            <code class="bg-base-300 px-2 py-1 rounded break-all">
              {debugInfo.value.token}
            </code>
          </div>
          <div>
            <strong>Token Length:</strong>{" "}
            <span class="badge badge-primary">
              {debugInfo.value.tokenLength}
            </span>
          </div>
          <div>
            <strong>Is Empty:</strong>{" "}
            <span
              class={`badge ${debugInfo.value.isEmpty ? "badge-error" : "badge-success"}`}
            >
              {debugInfo.value.isEmpty ? "Yes" : "No"}
            </span>
          </div>
        </div>
      </DebugSection>

      <DebugSection title="All URL Parameters">
        <pre class="bg-base-300 p-4 rounded text-sm overflow-x-auto">
          {JSON.stringify(debugInfo.value.allParams, null, 2)}
        </pre>
      </DebugSection>

      <DebugSection title="Test Links">
        <div class="space-y-2">
          <a
            href="/auth/reset-password?token=test-token-123"
            class="btn btn-primary btn-sm"
          >
            Test dengan token dummy
          </a>
          <br />
          <a
            href="/auth/reset-password?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imhpc3lhbWthbWlsOTlAZ21haWwuY29tIiwiaWF0IjoxNzUyMDkzNTUwLCJleHAiOjE3NTIwOTUzNTB9.O-u88Z5xpwKwhLFt9gj1dGucaS0PaikvLZJ5xv0tipc"
            class="btn btn-secondary btn-sm"
          >
            Test dengan token real
          </a>
        </div>
      </DebugSection>

      <DebugSection title="Console Log">
        <p class="text-sm text-base-content/70">
          Buka Developer Tools (F12) dan lihat tab Console untuk melihat log
          detail.
        </p>
        <button
          class="btn btn-accent btn-sm mt-2"
          onClick$={() => {
            console.log("🔍 Manual Debug Info:", debugInfo.value);
            console.log("🔍 Current URL:", window.location.href);
            console.log("🔍 URL Search Params:", window.location.search);
          }}
        >
          Log Manual Debug Info
        </button>
      </DebugSection>
    </div>
  );
});
