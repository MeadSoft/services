import { Category } from './models/Categories';
import { IMenuItem } from './models/interfaces/IMenuItem';
import { Size } from './models/Size';

export const MENU_ITEMS: IMenuItem[] = [
    //#region single flavor juices
    {
        name: 'Watermelon Juice',
        description: 'A refreshing drink made from fresh watermelon.',
        price: 7.0,
        categories: [
            Category.Drink,
            Category.Juice,
            Category.Cold,
            Category.SingleFlavor,
        ],
        size: Size['20oz'],
    },
    {
        name: 'Grapefruit Juice',
        description: 'A tangy and refreshing drink made from fresh grapefruit.',
        price: 6.5,
        imageUrl: 'images/menu-items/grapefruit-juice.webp',
        categories: [
            Category.Drink,
            Category.Juice,
            Category.Cold,
            Category.SingleFlavor,
        ],
        size: Size['20oz'],
    },
    {
        name: 'Mango Juice',
        description: 'A sweet and tropical drink made from fresh mangoes.',
        price: 7.0,
        categories: [
            Category.Drink,
            Category.Juice,
            Category.Cold,
            Category.SingleFlavor,
        ],
        size: Size['20oz'],
    },
    {
        name: 'Orange Juice',
        imageUrl: 'images/menu-items/orange-juice.webp',
        description: 'A classic breakfast drink made from fresh oranges.',
        price: 6.5,
        categories: [
            Category.Drink,
            Category.Juice,
            Category.Cold,
            Category.SingleFlavor,
        ],
        size: Size['20oz'],
    },
    //#endregion

    //#region mixed flavor juices
    {
        name: 'Berry Lover Juice',
        imageUrl: 'images/menu-items/berry-lover-juice.webp',
        description:
            'A delicious blend of strawberries, blackberries, and raspberries.',
        price: 7.9,
        categories: [
            Category.Drink,
            Category.Juice,
            Category.Cold,
            Category.MixedFlavor,
        ],
        isFavorite: true,
        size: Size['20oz'],
    },
    {
        name: 'Watermelon + Pineapple Juice',
        description: 'A tropical blend of watermelon and pineapple juices.',
        price: 7.5,
        categories: [
            Category.Drink,
            Category.Juice,
            Category.Cold,
            Category.MixedFlavor,
        ],
        size: Size['20oz'],
    },
    {
        name: 'Strawberry + Kiwi Juice',
        imageUrl: 'images/menu-items/strawberry-kiwi-juice.webp',
        description: 'A sweet and tangy blend of strawberries and kiwis.',
        price: 6.9,
        categories: [
            Category.Drink,
            Category.Juice,
            Category.Cold,
            Category.MixedFlavor,
        ],
        size: Size['20oz'],
    },
    {
        name: 'Strawberry + Banana Juice',
        description: 'A creamy and fruity blend of strawberries and bananas.',
        price: 6.5,
        imageUrl: 'images/menu-items/strawberry-banana-juice.webp',
        categories: [
            Category.Drink,
            Category.Juice,
            Category.Cold,
            Category.MixedFlavor,
        ],
        size: Size['20oz'],
    },
    {
        name: 'Kiwi + Banana Juice',
        description: 'A tropical blend of kiwis and bananas.',
        price: 6.9,
        imageUrl: 'images/menu-items/banana-kiwi-juice.webp',
        categories: [
            Category.Drink,
            Category.Juice,
            Category.Cold,
            Category.MixedFlavor,
        ],
        size: Size['20oz'],
    },
    {
        name: 'Orange + Pineapple Juice',
        imageUrl: 'images/menu-items/orange-pineapple-juice.webp',
        description: 'A tropical blend of oranges and pineapples',
        price: 6.9,
        categories: [
            Category.Drink,
            Category.Juice,
            Category.Cold,
            Category.MixedFlavor,
        ],
        size: Size['20oz'],
    },
    {
        name: 'Orange + Grapefruit Juice',
        description: 'A tangy and refreshing blend of oranges and grapefruit.',
        price: 6.9,
        imageUrl: 'images/menu-items/orange-grapefruit-juice.webp',
        categories: [
            Category.Drink,
            Category.Juice,
            Category.Cold,
            Category.MixedFlavor,
        ],
        size: Size['20oz'],
    },
    //#endregion

    //#region sandwiches
    {
        name: 'Ham & Egg Sandwich',
        imageUrl: 'images/menu-items/ham-egg-sandwich.webp',
        description:
            'Ham, boiled egg, american cheese, lettuce, and tomato with homemade sandwich sauce',
        price: 9.0,
        categories: [Category.Food, Category.Sandwich],
    },
    {
        name: 'Chicken Sandwich',
        imageUrl: 'images/menu-items/chicken-sandwich.webp',
        description:
            'Grilled chicken, american cheese, lettuce, and tomato with chili and homemade sandwich sauce',
        price: 9.5,
        categories: [Category.Food, Category.Sandwich],
    },
    {
        name: 'Spicy Tuna Sandwich',
        imageUrl: 'images/menu-items/spicy-tuna-sandwich.webp',
        description: 'Tuna, jalapeno onion, lettuce, and tomatoes',
        price: 9.0,
        categories: [Category.Food, Category.Sandwich],
    },
    {
        name: 'Chicken Guacamole Sandwich',
        description: 'Grilled chicken, guacamole, and chickpea mayo',
        price: 10.5,
        categories: [Category.Food, Category.Sandwich],
    },
    {
        name: 'Shrimp Guacamole Sandwich',
        imageUrl: 'images/menu-items/shrimp-guacamole-sandwich.webp',
        description: 'Shrimp, guacamole, and chickpea mayo',
        price: 10.5,
        categories: [Category.Food, Category.Sandwich],
    },
    //#endregion

    //#region mini pizzas
    {
        name: 'Cheese Pizza',
        description: 'Pita bread, pizza sauce, mozzarella cheese',
        price: 6.9,
        categories: [Category.Food, Category.MiniPizza],
        size: Size['7"'],
    },
    {
        name: 'Margherita Pizza',
        imageUrl: 'images/menu-items/7-in-margherita-pizza.webp',
        description:
            'Pita bread, spinach, tomato, honey, and mozzarella cheese',
        price: 7.9,
        categories: [Category.Food, Category.MiniPizza],
        size: Size['7"'],
    },
    {
        name: 'Pepperoni Pizza',
        description:
            'Pita bread, pizza sauce, pepperoni, and mozzarella cheese',
        price: 7.9,
        categories: [Category.Food, Category.MiniPizza],
        size: Size['7"'],
    },
    {
        name: 'Jeju Pizza',
        imageUrl: 'images/menu-items/7-in-jeju-pizza.webp',
        description:
            'Pita bread, ham, pineapple, mandarin orange, jalapeno, and mozarrella cheese',
        price: 8.9,
        categories: [Category.Food, Category.MiniPizza],
        size: Size['7"'],
    },
    {
        name: 'Sweet Potato Mousse Pizza',
        description:
            'Thin pita bread, bacon, corn, sweet potato mousse, and mozarrella cheese',
        price: 10.5,
        imageUrl: 'images/menu-items/9-in-sweet-potato-mouse-pizza.webp',
        categories: [Category.Food, Category.MiniPizza],
        isFavorite: true,
        size: Size['9"'],
    },
    //#endregion

    //#region bakery
    {
        name: 'Chocolate Muffin',
        price: 1.9,
        imageUrl: 'images/menu-items/chocolate-muffin.webp',
        description: 'A hot, gooey chocolate muffin with chocolate chips',
        categories: [Category.Food, Category.Bakery],
    },
    {
        name: 'Honey Butter Croissant',
        imageUrl: 'images/menu-items/honey-butter-croissant.webp',
        description: 'Butter, honey, strawberry, and whipping cream',
        price: 5.5,
        categories: [Category.Food, Category.Bakery],
    },
    {
        name: 'Honey Bread',
        imageUrl: 'images/menu-items/honey-bread.webp',
        description:
            'Bread, butter, whipping cream, strawberry, blueberry, and honey',
        price: 5.5,
        categories: [Category.Food, Category.Bakery],
    },
    {
        name: 'K - Garlic Bread',
        imageUrl: 'images/menu-items/k-garlic-bread.webp',
        description:
            'Butter, minced garlic, sugar, condensed milk, and parsley',
        price: 4.9,
        categories: [Category.Food, Category.Bakery],
    },
    {
        name: 'Potato Blanket Toast',
        imageUrl: 'images/menu-items/potato-blanket.webp',
        description: '',
        price: 5.9,
        categories: [Category.Food, Category.Bakery],
        isActive: false,
    },
    {
        name: 'Sausage In Garlic Bread',
        description:
            ' Chicken sausage inside homemade garlic bread with american cheese',
        price: 5.9,
        imageUrl: 'images/menu-items/sausage-in-garlic-bread.webp',
        categories: [Category.Food, Category.Bakery],
        isFavorite: true,
    },
    //#endregion

    //#region snacks
    {
        name: 'Glazed Banana',
        imageUrl: 'images/menu-items/glazed-banana.webp',
        price: 4.5,
        categories: [Category.Food, Category.Snack],
        isActive: false,
    },
    {
        name: 'K - Corn Dog',
        imageUrl: 'images/menu-items/k-corn-dog.webp',
        description:
            'Chicken sausage fried in corn dog batter with ketchup and mustard',
        price: 5.5,
        categories: [Category.Food, Category.Snack],
    },
    {
        name: 'Strawberry Mochi',
        imageUrl: 'images/menu-items/strawberry-mochi.webp',
        description: 'Mochi, red bean paste, and strawberry',
        price: 6.5,
        categories: [Category.Food, Category.Snack],
    },
    {
        name: 'Strawberry Flavored Mochi Ice Cream',
        description:
            'Strawberry ice cream inside mochi with strawberry slices, and a chocolate drizzle.',
        price: 3.9,
        imageUrl: 'images/menu-items/strawberry-flavored-mochi-ice-cream.webp',
        categories: [Category.Food, Category.Snack],
    },
    {
        name: 'Green Tea Flavored Mochi Ice Cream',
        description:
            'Green tea ice cream inside mochi with kiwi slices, and a chocolate drizzle.',
        price: 3.9,
        categories: [Category.Food, Category.Snack],
    },
    {
        name: 'Fresh Fruit Cream Sandwich',
        description:
            'Soft bread filled with fluffy whipped cream, sweet strawberries, and juicy kiwi slices.',
        imageUrl: 'images/menu-items/fresh-fruit-cream-sandwich.webp',
        price: 5.9,
        categories: [Category.Food, Category.Snack, Category.Sandwich],
    },
    //#endregion

    //#region hot coffee
    {
        name: 'Americano',
        description: '2 shots of expresso with water',
        price: 3.5,
        categories: [Category.Drink, Category.Hot, Category.Coffee],
        size: Size['16oz'],
    },
    {
        name: 'K - Coffee',
        description: 'Sweet Korean mixed coffee',
        price: 3.5,
        imageUrl: 'images/menu-items/k-coffee.webp',
        categories: [Category.Drink, Category.Hot, Category.Coffee],
        size: Size['10oz'],
    },
    {
        name: 'Vanilla Latte',
        description: '2 shots of expresso with steamed milk and vanilla syrup',
        price: 6.0,
        categories: [Category.Drink, Category.Hot, Category.Coffee],
        size: Size['16oz'],
    },
    {
        name: 'Caramel Latte',
        description: '2 shots of expresso with steamed milk and caramel syrup',
        price: 6.0,
        categories: [Category.Drink, Category.Hot, Category.Coffee],
        size: Size['16oz'],
    },
    {
        name: 'Sweet Milk Latte',
        description: '2 shots of expresso with steamed and condensed milk',
        price: 6.0,
        categories: [Category.Drink, Category.Hot, Category.Coffee],
        size: Size['16oz'],
    },
    {
        name: 'Cloud Latte',
        description:
            'Sweet Korean mixed coffee with steamed milk and a cloud of whipped steamed milk on top',
        price: 6.0,
        imageUrl: 'images/menu-items/cloud-latte.webp',
        categories: [Category.Drink, Category.Hot, Category.Coffee],
        size: Size['16oz'],
    },
    {
        name: 'Blue Ocean Latte',
        description:
            '2 shots of expresso with steamed milk, condensed milk, and blue curacao syrup',
        price: 6.5,
        categories: [Category.Drink, Category.Hot, Category.Coffee],
        size: Size['16oz'],
    },
    {
        name: 'Haru Signature Latte',
        imageUrl: 'images/menu-items/haru-signature-latte.webp',
        description:
            '2 shots of expresso with steamed milk and homemade orange syrup',
        price: 6.5,
        categories: [Category.Drink, Category.Hot, Category.Coffee],
        isFavorite: true,
        size: Size['16oz'],
    },
    {
        name: 'Expresso',
        description: '2 shots of expresso',
        price: 3.0,
        imageUrl: 'images/menu-items/expresso.webp',
        categories: [Category.Drink, Category.Hot, Category.Coffee],
        size: Size['16oz'],
    },
    {
        name: 'Orange Expresso',
        description: '2 shots of expresso with homemade orange syrup',
        price: 3.5,
        categories: [Category.Drink, Category.Hot, Category.Coffee],
        size: Size['16oz'],
    },
    {
        name: 'Cafe Latte',
        description: '2 shots of expresso with non-sweet steamed milk',
        price: 4.0,
        categories: [Category.Drink, Category.Hot, Category.Coffee],
        size: Size['16oz'],
    },
    //#endregion

    //#region cold coffee
    {
        name: 'Iced Americano',
        description: '3 shots of expresso with water over ice',
        price: 4.0,
        categories: [Category.Drink, Category.Cold, Category.Coffee],
        size: Size['20oz'],
    },
    {
        name: 'Iced K - Coffee',
        description: 'Sweet Korean mixed coffee over ice',
        price: 4.0,
        categories: [Category.Drink, Category.Cold, Category.Coffee],
        size: Size['16oz'],
    },
    {
        name: 'Iced Vanilla Latte',
        description:
            '2 shots of expresso with milk, vanilla syrup, and a homemade heavy cream mix over ice',
        price: 6.5,
        categories: [Category.Drink, Category.Cold, Category.Coffee],
        size: Size['20oz'],
    },
    {
        name: 'Iced Caramel Latte',
        description:
            '2 shots of expresso with caramel syrup, whip cream with caramel drizzle, and a homemade heavy cream mix over ice',
        price: 6.5,
        categories: [Category.Drink, Category.Cold, Category.Coffee],
        size: Size['20oz'],
    },
    {
        name: 'Iced Sweet Milk Latte',
        description:
            '2 shots of expresso with condensed milk, a homemade milk mixture, and a homemade heavy cream mix over ice',
        price: 6.5,
        categories: [Category.Drink, Category.Cold, Category.Coffee],
        size: Size['20oz'],
    },
    {
        name: 'Iced Cloud Latte',
        description:
            'Sweet Korean mixed coffee with steamed milk and a cloud of whipped steamed milk on top over ice',
        price: 6.5,
        categories: [Category.Drink, Category.Cold, Category.Coffee],
        size: Size['20oz'],
    },
    {
        name: 'Iced Blue Ocean Latte',
        description:
            '2 shots of expresso with milk, condensed milk, blue curacao syrup, and a homemade heavy cream mix over ice',
        price: 6.9,
        imageUrl: 'images/menu-items/iced-blue-ocean-latte.webp',
        categories: [Category.Drink, Category.Cold, Category.Coffee],
        size: Size['20oz'],
    },
    {
        name: 'Iced Haru Signature Latte',
        description:
            '2 shots of expresso with homemade orange syrup, and whipped homemade heavy cream mix over ice',
        price: 6.9,
        categories: [Category.Drink, Category.Cold, Category.Coffee],
        isFavorite: true,
        size: Size['20oz'],
    },
    {
        name: 'Iced Cafe Latte',
        description:
            '2 shots of expresso, non-sweet milk, and heavy cream over ice',
        price: 4.5,
        categories: [Category.Drink, Category.Cold, Category.Coffee],
        size: Size['20oz'],
    },
    //#endregion

    //#region hot non coffee
    {
        name: 'Hot Matcha Latte',
        description: 'Hot water, matcha powder, and steamed milk',
        price: 6.5,
        categories: [Category.Drink, Category.Hot, Category.NonCoffee],
        size: Size['16oz'],
    },
    {
        name: 'Hot Yuza Matcha Latte',
        description:
            'Hot water, yuza tea, matcha powder, and steamed milk. Yuza is a citrus fruit from Korea.',
        price: 6.9,
        categories: [Category.Drink, Category.Hot, Category.NonCoffee],
        size: Size['16oz'],
    },
    //#endregion

    //#region iced non coffee
    {
        name: 'Peach Iced Tea',
        price: 5.0,
        imageUrl: 'images/menu-items/peach-iced-tea.webp',
        categories: [Category.Drink, Category.Cold, Category.NonCoffee],
        size: Size['20oz'],
    },
    {
        name: 'Iced Choco Latte',
        description:
            'Homemade chocolate syrup with milk, whipped cream, and a chocolate drizzle on top',
        price: 6.0,
        imageUrl: 'images/menu-items/iced-choco-latte.webp',
        categories: [Category.Drink, Category.Cold, Category.NonCoffee],
        size: Size['20oz'],
    },
    {
        name: 'Iced Strawberry Latte',
        description:
            'Homemade strawberry syrup with milk, and a whole strawberry on top',
        price: 6.5,
        imageUrl: 'images/menu-items/strawberry-latte.webp',
        categories: [Category.Drink, Category.Cold, Category.NonCoffee],
        size: Size['20oz'],
    },
    {
        name: 'Iced Blueberry Latte',
        description:
            'Homemade blueberry syrup with milk, and blueberries on top',
        price: 6.9,
        categories: [Category.Drink, Category.Cold, Category.NonCoffee],
        size: Size['20oz'],
    },
    {
        name: 'Iced Matcha Latte',
        description: 'Matcha powder with milk',
        price: 6.9,
        categories: [Category.Drink, Category.Cold, Category.NonCoffee],
        isFavorite: true,
        size: Size['20oz'],
    },
    {
        name: 'Iced Choco Strawberry Delight',
        description:
            'Strawberry milk, whipped chocolate heavy cream, topped with regular whipped cream and sprinkles',
        price: 7.5,
        imageUrl: 'images/menu-items/choco-strawberry-delight.webp',
        categories: [Category.Drink, Category.Cold, Category.NonCoffee],
        isFavorite: true,
        size: Size['20oz'],
    },
    //#endregion

    //#region ade
    {
        name: 'Blood Lemonade',
        imageUrl: 'images/menu-items/blood-lemonade.webp',
        description:
            'Homemade lemon syrup with sparkling water, and blood orange syrup',
        price: 5.0,
        categories: [Category.Drink, Category.Cold, Category.Ade],
        size: Size['20oz'],
    },
    {
        name: 'Aurora Lemonade',
        imageUrl: 'images/menu-items/aurora-lemonade.webp',
        description:
            'Homemade lemon syrup with sparkling water, blue curacao syrup, and butterfly pea powder water',
        price: 5.9,
        categories: [Category.Drink, Category.Cold, Category.Ade],
        isFavorite: true,
        size: Size['20oz'],
    },
    {
        name: 'Twilight Blueberry-ade',
        imageUrl: 'images/menu-items/twilight-blueberry-ade.webp',
        description:
            'Homemade blueberry syrup with sparkling water, blue curacao syrup, and butterfly pea powder water',
        price: 5.9,
        categories: [Category.Drink, Category.Cold, Category.Ade],
        size: Size['20oz'],
    },
    {
        name: 'Berry Lemonade',
        description:
            'Homemade strawberry and lemon syrup, sparkling water, and lemon slices',
        price: 6.5,
        imageUrl: 'images/menu-items/berry-lemonade.webp',
        categories: [Category.Drink, Category.Cold, Category.Ade],
        size: Size['20oz'],
    },
    {
        name: 'Peach Lemon Tea',
        description: 'Peach iced tea with lemonade',
        price: 5.5,
        imageUrl: 'images/menu-items/peach-lemon-tea.webp',
        categories: [Category.Drink, Category.Cold, Category.Ade],
        size: Size['20oz'],
    },
    //#endregion

    //#region seasonal
    {
        name: 'Iced Spring Latte',
        description:
            'Homemade strawberry milk, butterfly pea powder milk, and homemade whipped heavy cream mix',
        price: 6.9,
        imageUrl: 'images/menu-items/spring-latte.webp',
        categories: [
            Category.Drink,
            Category.Cold,
            Category.Coffee,
            Category.Seasonal,
            Category.Specials,
        ],
        size: Size['20oz'],
    },
    {
        name: 'Summer Red Sparkling',
        description: 'Cubed watermelon, Sprite, and blood orange syrup',
        price: 6.9,
        imageUrl: 'images/menu-items/summer-sparkling.webp',
        categories: [
            Category.Drink,
            Category.Seasonal,
            Category.Cold,
            Category.Specials,
        ],
        size: Size['20oz'],
    },
    {
        name: 'Fall Pumpkin Spice Latte',
        description:
            '2 shots of expresso, steamed milk, cinnamon powder, pumpkin powder, and topped with whipped cream and more cinnamon powder',
        price: 6.5,
        imageUrl: 'images/menu-items/fall-pumpkin-spice-latte.webp',
        categories: [
            Category.Drink,
            Category.Hot,
            Category.Coffee,
            Category.Seasonal,
            Category.Specials,
        ],
        size: Size['16oz'],
    },
    {
        name: 'Iced Fall Pumpkin Spice Latte',
        description:
            '2 shots of expresso, milk, pumpkin powder, cinnamon powder, and topped with whipped cream and more cinnamon powder',
        price: 7.0,
        imageUrl: 'images/menu-items/iced-fall-pumpkin-spice-latte.webp',
        categories: [
            Category.Drink,
            Category.Cold,
            Category.Coffee,
            Category.Seasonal,
            Category.Specials,
        ],
        size: Size['20oz'],
    },
    {
        name: 'Winter Hot Chocolate',
        description:
            'Homemade chocolate syrup, steamed milk, topped with one marshmallow and chocolate powder',
        price: 5.0,
        imageUrl: 'images/menu-items/winter-hot-chocolate.webp',
        categories: [
            Category.Drink,
            Category.Hot,
            Category.NonCoffee,
            Category.Seasonal,
            Category.Specials,
        ],
        size: Size['20oz'],
    },
    //#endregion

    //#region hot tea
    {
        name: 'Green Tea',
        description: '',
        price: 3.9,
        categories: [Category.Drink, Category.Hot, Category.Tea],
        size: Size['16oz'],
    },
    {
        name: 'Yuza Tea',
        description: 'Yuza tea with honey. Yuza is a citrus fruit from Korea.',
        price: 4.5,
        categories: [Category.Drink, Category.Hot, Category.Tea],
        size: Size['16oz'],
    },
    {
        name: 'Ginger Tea',
        description: 'Ginger tea with honey',
        price: 4.5,
        categories: [Category.Drink, Category.Hot, Category.Tea],
        size: Size['16oz'],
    },
    {
        name: 'Jujube Tea',
        description: 'Jujube tea with honey. Jujube is a red date from Korea.',
        price: 4.9,
        categories: [Category.Drink, Category.Hot, Category.Tea],
        size: Size['16oz'],
    },
    //#endregion

    //#region anime drinks
    {
        name: 'Chocolate Form: Flowing Mint Latte',
        description:
            'Inspired by Tanjiro from Demon Slayer. Chocolate syrup, mint syrup, milk, and whipped cream with sprinkles',
        price: 7.0,
        imageUrl: 'images/menu-items/chocolate-form-flowing-mint-latte.webp',
        categories: [
            Category.Drink,
            Category.Cold,
            Category.NonCoffee,
            Category.Anime,
            Category.Specials,
        ],
        size: Size['20oz'],
    },
    {
        name: 'Sweet Demon Latte',
        description:
            'Inspired by Nezuko from Demon Slayer. Chocolate syrup, strawberry syrup, milk, and whipped cream with sprinkles',
        price: 7.0,
        imageUrl: 'images/menu-items/sweet-demon-latte.webp',
        categories: [
            Category.Drink,
            Category.Cold,
            Category.NonCoffee,
            Category.Anime,
            Category.Specials,
        ],
        size: Size['20oz'],
    },
    {
        name: 'Love Blossom Matcha Latte',
        description:
            'Inspired by Mitsuri from Demon Slayer. Strawberry syrup, milk, matcha powder, and a whole strawberry',
        price: 7.0,
        imageUrl: 'images/menu-items/love-blossom-matcha-latte.webp',
        categories: [
            Category.Drink,
            Category.Cold,
            Category.NonCoffee,
            Category.Anime,
            Category.Specials,
        ],
        size: Size['20oz'],
    },
    {
        name: 'Mango Flameade',
        description:
            'Inspired by Rengoku from Demon Slayer. Mango syrup, blood orange syrup, Sprite, and a slice of orange',
        price: 6.0,
        imageUrl: 'images/menu-items/mango-flameade.webp',
        categories: [
            Category.Drink,
            Category.Cold,
            Category.Ade,
            Category.Anime,
            Category.Specials,
        ],
        size: Size['20oz'],
    },
    {
        name: 'Harmonic Grapeade',
        description:
            'Inspired by Tengen from Demon Slayer. Grape syrup, Sprite, and a slice of kiwi',
        price: 5.5,
        imageUrl: 'images/menu-items/harmonic-grapeade.webp',
        categories: [
            Category.Drink,
            Category.Cold,
            Category.Ade,
            Category.Anime,
            Category.Specials,
        ],
        size: Size['20oz'],
    },
    {
        name: 'Lemonade Type: Explosive Razz',
        description:
            'Inspired by Akaza from Demon Slayer. Raspberry syrup, lemon syrup, blue curacao syrup, Sprite, and a slice of lemon',
        price: 6.0,
        imageUrl: 'images/menu-items/lemonade-type-explosive-razz.webp',
        categories: [
            Category.Drink,
            Category.Cold,
            Category.Ade,
            Category.Anime,
            Category.Specials,
        ],
        size: Size['20oz'],
    },
    {
        name: 'Moe Moe Sweet Mint Beam',
        description:
            'Inspired By Momo from Dandadan. Strawberry syrup, milk, mint syrup, whipped heavy cream, and a whole strawberry',
        price: 6.5,
        imageUrl: 'images/menu-items/moe-moe-sweet-mint-beam.webp',
        categories: [
            Category.Drink,
            Category.Cold,
            Category.NonCoffee,
            Category.Anime,
            Category.Specials,
        ],
        size: Size['20oz'],
    },
    {
        name: 'Cursed Turbo Razz Soda',
        description:
            'Inspired By Okarun from Dandadan. Raspberry syrup, blue curacao syrup, blood orange syrup, Sprite, whipped cream, with a raspberry topping',
        price: 7.0,
        imageUrl: 'images/menu-items/cursed-turbo-razz-soda.webp',
        categories: [
            Category.Drink,
            Category.Cold,
            Category.NonCoffee,
            Category.Anime,
            Category.Specials,
        ],
        size: Size['20oz'],
    },
    {
        name: 'Strawberry Butterfly Spiral',
        description:
            'Inspired By Aira from Dandadan. Strawberry syrup, Sprite, butterfly pea powder, water, and a whole strawberry',
        price: 6.0,
        imageUrl: 'images/menu-items/strawberry-butterfly-spiral.webp',
        categories: [
            Category.Drink,
            Category.Cold,
            Category.NonCoffee,
            Category.Anime,
            Category.Specials,
        ],
        size: Size['20oz'],
    },
    {
        name: 'Arisen Lychee Lemonade',
        description:
            'Inspired By Jin Woo from Solo Leveling. Lychee syrup, lemon syrup, blue curacao syrup, blood orange syrup, Sprite, and a slice of lemon',
        price: 6.0,
        imageUrl: 'images/menu-items/arisen-lychee-lemonade.webp',
        categories: [
            Category.Drink,
            Category.Cold,
            Category.Ade,
            Category.Anime,
            Category.Specials,
        ],
        size: Size['20oz'],
    },
    //#endregion
];
