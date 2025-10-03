# AGRI-HOPE Management Manual

Audience: Farmers (Vendors), Admins

This manual explains how to organize your marketplace and manage products in a simple, consistent way.

1) Roles and access
- Farmer (Vendor): Creates and manages their own marketplace(s) and products. Can only edit/delete their own data.
- Buyer: Browses, filters, and purchases products. Cannot create or edit marketplaces or products.
- Admin: Oversees the platform, can moderate users and content.

2) Category taxonomy (recommended)
Use a small, clear set of categories so products are easy to add and find:
- fruits_vegetables: All fresh fruits and vegetables
- farming_tools: Tools and equipment used for farming
- meat_livestock: Meat and live animals (sheep, cows, etc.)
- dairy_products: Milk, cheese, yogurt, butter, etc.

Notes
- These categories are enforced at the API level to keep data consistent.
- If you need an additional category in the future, request it from the admin so all farmers use the same set.

3) Marketplace management (farmers)
Where: Vendor Dashboard → Manage Marketplaces (or /vendor/marketplaces)

Create a marketplace
- Required: name, description, optional location (country/city/address), categories (select from recommended set).
- The system creates a unique slug from the name (used in URLs). Example: "Green Valley Farm" → green-valley-farm
- Tip: Choose a descriptive name buyers will recognize.

Edit a marketplace
- You can update name, description, location, and categories at any time.
- If you change the name, the slug may update to match the new name.

Delete a marketplace
- You cannot delete a marketplace that still has products.
- First delete or move products elsewhere; then delete the marketplace.

Ownership & security
- You can only manage your own marketplaces. The system validates ownership on every change.

4) Product management (farmers)
Where: Vendor Dashboard → Manage Products (or /vendor/products)

Add a product
- Required fields: title, description, price, category, marketplace
- Optional fields: images (URLs), inventory, unit (kg, piece, dozen)
- Marketplace must be one of your own marketplaces; pick it from the dropdown.
- Categories must be one of: fruits_vegetables, farming_tools, meat_livestock, dairy_products

Edit a product
- You may update title, description, price, category, images, inventory, unit.
- You may change the marketplace if the new marketplace also belongs to you.

Delete a product
- You can delete your own products anytime. This is permanent.

Visibility
- Products are visible by default (isActive: true).
- If a product should not be shown for a time, you can set isActive to false (feature may be exposed in the UI as a toggle).

5) Inventory and pricing
- Inventory: Whole numbers are recommended; use unit to express kg, piece, dozen, etc.
- Pricing: Always use a positive number. Avoid changing price frequently on live products to reduce buyer confusion.
- Images: Use clear, high-quality photos. If multiple images, place the main image first.

6) Buyer experience (what they see)
- Category filters: Buyers can browse by the recommended categories.
- Marketplace pages: Buyers can view products grouped by a farmer’s marketplace.
- Product detail: Title, description, images, unit, price, and available inventory.

7) Best practices for farmers
- Keep names short and descriptive (e.g., "Organic Tomatoes", not "Product #12").
- Use units consistently (always kg or always piece for the same type of product).
- Keep your marketplace info updated (location, categories) so buyers can find you.
- Use the allowed category list for every product—this ensures better search and filters.

8) Common errors and how to fix them
- 400 Bad Request when adding a product
  - Cause: Invalid marketplace selected or missing required fields
  - Fix: Select a marketplace you own from the dropdown; ensure title, description, price, and category are filled. Price must be a number greater than or equal to 0. Category must be one of the 4 allowed values.
- Product not showing on buyer pages
  - Cause: isActive is false, or filters (category/marketplace) exclude it
  - Fix: Ensure isActive is true; verify the product category matches what buyers are filtering by.
- Cannot delete marketplace
  - Cause: Marketplace still has products
  - Fix: Delete or move products to another marketplace first, then delete the marketplace.

9) Admin guidance
- Keep the category set small and stable. Introduce new categories only when truly needed.
- Audit products for proper categorization to maintain clean browsing.
- Support farmers with data corrections where required (ownership and access must be respected).

10) Quick start checklists
Farmer – create marketplace and first product
- [ ] Create a marketplace (name, description, location)
- [ ] Add a product: title, description, images, price, inventory, unit, category
- [ ] Verify on buyer pages that it appears under the right category

Farmer – day-to-day product updates
- [ ] Adjust inventory after sales or restocking
- [ ] Update price if market conditions change
- [ ] Keep images current and representative

Appendix
- Allowed categories (technical names):
  - fruits_vegetables, farming_tools, meat_livestock, dairy_products
- URLs and routes (examples):
  - Vendor dashboard: /vendor/dashboard
  - Vendor products: /vendor/products
  - Vendor marketplaces: /vendor/marketplaces
  - Buyer products: /buyer/products
- Error handling: The system returns clear error messages for validation and ownership rules; read them and adjust your inputs accordingly.
