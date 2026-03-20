export interface IMapper<TEntity, TModel> {
    to(entity: TEntity): TModel;
    from(model: TModel): TEntity;
}
