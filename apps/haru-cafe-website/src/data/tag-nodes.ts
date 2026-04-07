export interface ITagNode {
    tagId: string | null;
    childTagIds: string[];
}

export const TAG_GRAPH: ITagNode[] = [
    {
        tagId: null,
        childTagIds: ['Drink', 'Food'],
    },
    {
        tagId: 'Food',
        childTagIds: ['Sandwich', 'Mini Pizza', 'Bakery', 'Snack'],
    },
    {
        tagId: 'Drink',
        childTagIds: ['Hot', 'Cold', 'Specials'],
    },
    {
        tagId: 'Hot',
        childTagIds: ['Coffee', 'Non-Coffee'],
    },
    {
        tagId: 'Cold',
        childTagIds: ['Coffee', 'Non-Coffee', 'Ade', 'Juice'],
    },
    {
        tagId: 'Specials',
        childTagIds: ['Seasonal', 'Anime'],
    },
];
