import { readCommerceStore, writeCommerceStore } from "../../../../_lib/commerceStore";
import { buildShoppingList } from "../../_shoppingList";

export async function POST() {
  const store = await readCommerceStore();
  const saved = await writeCommerceStore({
    ...store,
    shoppingList: { ...store.shoppingList, items: [] },
  });

  return Response.json({
    ok: true,
    userId: saved.userId,
    list: buildShoppingList(saved),
    updatedAt: saved.updatedAt,
  });
}
