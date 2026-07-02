import { useDocumentHead } from "@app/modules/main/hooks/useDocumentHead";
import PageHeaderInterface from "@app/modules/main/interfaces/pageHeaderInterface";
import { filterProducts } from "@app/modules/products/helpers/filterProducts";
import { useProductsActions } from "@app/modules/products/hooks/useProductsActions";
import ProductsDetailInterface from "@app/modules/products/interfaces/productsDetailInterface";
import ProductsFormInterface from "@app/modules/products/interfaces/productsFormInterface";
import ProductsListInterface from "@app/modules/products/interfaces/productsListInterface";
import { useProductsProvider } from "@app/modules/products/states/productsProvider";
import { useEffect } from "react";

export default function ProductsModule() {
  const { getProductsState } = useProductsProvider();
  const {
    handleLoad,
    handleSearch,
    handleFilterCategory,
    handleFilterStatus,
    handleOpenCreate,
    handleOpenEdit,
    handleOpenDetail,
    handleCancel,
    handleChangeField,
    handleSubmit,
    handleDelete
  } = useProductsActions();
  const state = getProductsState;
  const visible = filterProducts(
    state.items,
    state.query,
    state.categoryFilter,
    state.statusFilter
  );

  useDocumentHead({
    title: "Productos",
    description: "Catálogo de productos, precios, IVA y stock de la veterinaria."
  });

  useEffect(() => {
    handleLoad();
  }, []);

  return (
    <section>
      <PageHeaderInterface
        title="Productos"
        subtitle="Catálogo de productos e insumos, con precios, IVA y control de stock."
      />

      {state.mode === "detail" && state.selected ? (
        <ProductsDetailInterface
          product={state.selected}
          onEdit={handleOpenEdit}
          onDelete={handleDelete}
          onBack={handleCancel}
        />
      ) : null}

      {state.mode === "create" || state.mode === "edit" ? (
        <ProductsFormInterface
          form={state.form}
          errors={state.errors}
          saving={state.saving}
          isEdit={state.mode === "edit"}
          onChange={handleChangeField}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : null}

      {state.mode === "list" ? (
        <ProductsListInterface
          items={visible}
          query={state.query}
          categoryFilter={state.categoryFilter}
          statusFilter={state.statusFilter}
          onSearch={handleSearch}
          onFilterCategory={handleFilterCategory}
          onFilterStatus={handleFilterStatus}
          onOpenCreate={handleOpenCreate}
          onOpenDetail={handleOpenDetail}
          onOpenEdit={handleOpenEdit}
        />
      ) : null}
    </section>
  );
}
