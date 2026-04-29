export enum Category {
    Drink = 'Drink',
    Food = 'Food',
    Juice = 'Juice',
    SingleFlavor = 'Single Flavor',
    MixedFlavor = 'Mixed Flavor',
    Sandwich = 'Sandwich',
    MiniPizza = 'Mini Pizza',
    Bakery = 'Bakery',
    Snack = 'Snack',
    Coffee = 'Coffee',
    NonCoffee = 'Non-Coffee',
    Decaf = 'Decaf',
    Hot = 'Hot',
    Cold = 'Cold',
    Ade = 'Ade',
    Specials = 'Specials',
    Seasonal = 'Seasonal',
    Tea = 'Tea',
    Anime = 'Anime',
}

export const MutuallyExclusiveCategories: Category[][] = [
    // [Category.Food, Category.Drink],
    // [Category.Coffee, Category.NonCoffee],
    // [Category.Hot, Category.Iced],
];
