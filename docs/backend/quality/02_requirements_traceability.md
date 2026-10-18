---
code: "BE-QA-02"
name: "Rastreabilidade de requisitos no backend"
updated: "2026/10/18"
---

# Rastreabilidade de requisitos no backend

Matriz entre os critérios de aceitação (CA) e regras de negócio (RN) dos cartões e os testes automatizados do backend. Os caminhos são relativos a `backend/tests/integration/`. Os testes de tela estão na [rastreabilidade do frontend](../../frontend/quality/01_test_strategy_and_traceability.md).

| Cartão | Requisito            | Teste                                                                      |
| ------ | -------------------- | -------------------------------------------------------------------------- |
| US01   | CA#2                 | `catalog/test_storefront.py::test_card_shows_name_image_price_and_availability` |
| US01   | RN#1                 | `catalog/test_storefront.py::test_inactive_products_are_hidden`            |
| US01   | RN#2                 | `catalog/test_storefront.py::test_featured_products_come_first`            |
| US01   | Imagens              | `catalog/test_storefront.py::test_image_is_served_with_its_content_type`, `test_missing_image_is_a_problem` |
| US02   | CA#1, CA#2           | `catalog/test_filters.py::test_filters_by_category_and_flavor`, `test_filters_by_price_range` |
| US02   | CA#3, RN#1           | `catalog/test_filters.py::test_searches_by_name_ignoring_case`             |
| US02   | Validação            | `catalog/test_filters.py::test_inverted_price_range_is_rejected`, `test_lists_filter_options` |
| US03   | CA#1, CA#2           | `catalog/test_product_detail.py::test_detail_shows_full_information`       |
| US03   | RN#1                 | `catalog/test_product_detail.py::test_inactive_product_is_not_found`       |
| US04   | CA#1, RNF#1          | `accounts/test_registration.py::test_creates_account_with_hashed_password` |
| US04   | CA#2                 | `accounts/test_registration.py::test_required_fields_are_validated`        |
| US04   | CA#3, RN#1           | `accounts/test_registration.py::test_duplicate_email_is_rejected`          |
| US04   | RN#2                 | `accounts/test_registration.py::test_weak_password_is_rejected`            |
| US05   | CA#1, CA#3           | `accounts/test_login.py::test_valid_credentials_return_a_token`            |
| US05   | CA#2                 | `accounts/test_login.py::test_wrong_password_is_reported`                  |
| US05   | RN#1                 | `accounts/test_login.py::test_repeated_failures_lock_the_account`          |
| US05   | RN#2                 | `accounts/test_login.py::test_expired_token_requires_new_sign_in`, `test_missing_token_requires_sign_in` |
| US06   | CA#1, CA#2, CA#3     | `cart/test_add_to_cart.py::test_adding_updates_lines_and_subtotal`         |
| US06   | RN#1                 | `cart/test_add_to_cart.py::test_quantity_must_be_at_least_one`             |
| US06   | RN#2                 | `cart/test_add_to_cart.py::test_unavailable_product_cannot_be_added`       |
| US06   | Limite por produto   | `cart/test_add_to_cart.py::test_quantity_limit_per_product`                |
| US07   | CA#1, CA#3           | `cart/test_update_cart.py::test_changing_quantity_recalculates_subtotal`   |
| US07   | CA#2                 | `cart/test_update_cart.py::test_removing_item_empties_cart`                |
| US07   | RN#1                 | `cart/test_update_cart.py::test_zero_quantity_needs_explicit_removal`      |
| US07   | RN#2                 | `cart/test_update_cart.py::test_unavailable_product_can_only_decrease`     |
| US08   | CA#1, CA#3, RN#1     | `orders/test_fulfillment.py::test_pickup_has_no_fee_and_no_address`        |
| US08   | CA#2, CA#3           | `orders/test_fulfillment.py::test_delivery_adds_fee_and_address`           |
| US08   | RN#2                 | `orders/test_fulfillment.py::test_delivery_requires_an_address`            |
| US09   | CA#1                 | `accounts/test_addresses.py::test_registers_every_field`                   |
| US09   | CA#2, RN#1           | `accounts/test_addresses.py::test_required_fields_are_validated`           |
| US09   | CA#3, RN#2           | `accounts/test_addresses.py::test_keeps_several_addresses_with_one_primary`, `test_deleting_primary_promotes_another` |
| US10   | CA#1, CA#3, RN#2     | `orders/test_checkout.py::test_pix_order_is_confirmed_and_cart_emptied`    |
| US10   | CA#2                 | `orders/test_checkout.py::test_delivery_total_includes_fee`                |
| US10   | RN#1                 | `orders/test_checkout.py::test_requires_valid_cart`                        |
| US10   | RNF#1                | `orders/test_checkout.py::test_card_payment_keeps_only_last_digits`, `test_declined_payment_creates_nothing`, `test_invalid_card_is_rejected` |
| US11   | CA#1, CA#2, RN#2     | `orders/test_tracking.py::test_shows_status_creation_time_and_history`     |
| US11   | RN#1                 | `orders/test_tracking.py::test_other_customers_cannot_track`               |
| US12   | CA#1, CA#2           | `orders/test_custom_orders.py::test_request_is_registered_apart_and_pending` |
| US12   | RN#1                 | `orders/test_custom_orders.py::test_minimum_lead_time_is_enforced`         |
| US12   | CA#3, RN#2           | `orders/test_custom_orders.py::test_store_approves_with_price_once`, `test_approval_requires_a_price` |
| US13   | CA#1                 | `catalog/test_manage_catalog.py::test_creates_product_with_image`          |
| US13   | CA#2, CA#3, RN#2     | `catalog/test_manage_catalog.py::test_edits_and_inactivates_without_deleting` |
| US13   | RN#1                 | `catalog/test_manage_catalog.py::test_publishing_requires_minimum_data`    |
| US13   | Acesso e upload      | `catalog/test_manage_catalog.py::test_customers_cannot_manage_catalog`, `test_refuses_unsupported_image` |
| US14   | CA#1, CA#2, RN#2     | `catalog/test_availability.py::test_unavailable_product_stays_visible_but_flagged`, `test_store_can_hide_unavailable_product` |
| US14   | CA#3, RN#1           | `catalog/test_availability.py::test_change_reaches_existing_carts`         |
| US15   | CA#1, CA#3           | `orders/test_manage_orders.py::test_lists_orders_with_customer_and_notes`  |
| US15   | CA#2, RN#1           | `orders/test_manage_orders.py::test_pickup_flow_reaches_completion`, `test_pickup_never_goes_out_for_delivery` |
| US15   | RN#2                 | `orders/test_manage_orders.py::test_final_status_requires_previous_steps`  |
| US16   | CA#1, RN#2           | `promotions/test_promotions.py::test_running_campaign_sets_the_displayed_and_charged_price` |
| US16   | RN#1                 | `promotions/test_promotions.py::test_campaign_outside_period_does_not_change_price`, `test_period_must_end_after_start` |
| US16   | CA#2                 | `promotions/test_promotions.py::test_marks_product_as_featured`            |
| US16   | CA#3                 | `promotions/test_promotions.py::test_combo_discount_applies_to_complete_sets` |
