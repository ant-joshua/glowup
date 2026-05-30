import { products } from "../_data";

function filterCatalog(searchParams: URLSearchParams) {
  const q = (searchParams.get("q") ?? "").trim().toLowerCase();
  const category = (searchParams.get("category") ?? "").trim().toLowerCase();

  return products.filter((product) => {
    if (category && product.category.toLowerCase() !== category) {
      return false;
    }

    if (!q) {
      return true;
    }

    const haystack = [
      product.id,
      product.name,
      product.brand,
      product.category,
      ...product.tags,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}

export function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const items = filterCatalog(searchParams);

  return Response.json({
    ok: true,
    query: {
      q: searchParams.get("q") ?? "",
      category: searchParams.get("category") ?? "",
    },
    items,
    total: items.length,
    updatedAt: "2026-05-01T00:00:00.000Z",
  });
}
