export interface ITagNode {
    tagId: string | null;
    childTagIds: string[];
}

export const TAG_GRAPH: ITagNode[] = [
    {
        tagId: null,
        childTagIds: [
            '7c948c42-4733-4043-a113-81890f047c3d',
            '0fe197e5-c63a-4d67-9de0-d00d7190b9f0',
        ],
    },
    {
        tagId: '7c948c42-4733-4043-a113-81890f047c3d',
        childTagIds: [
            '83ac445a-d46d-472b-9f2c-fc563aae1727',
            'cf2b256a-b18f-4b82-b9e3-a7652f732fd0',
            'faa97761-eeca-4ff9-914e-2f725d2dfac1',
            '6b111c26-0f0d-4ac3-aa84-10c59bf2f068',
        ],
    },
    {
        tagId: '9b887161-c818-4a0f-b6e7-36eeaa53f587',
        childTagIds: [
            '37ce082d-56a2-463b-9c7c-8dea671e9de0',
            '0d1d6672-9459-4003-b2f0-916e9b2eeb92',
        ],
    },
    {
        tagId: '0fe197e5-c63a-4d67-9de0-d00d7190b9f0',
        childTagIds: [
            '0d8e4e3d-c5e0-445c-a851-0964404fc376',
            'd539e003-5c0e-480a-8a4d-fac5b4db8d99',
            '9b887161-c818-4a0f-b6e7-36eeaa53f587',
        ],
    },
    {
        tagId: '0d8e4e3d-c5e0-445c-a851-0964404fc376',
        childTagIds: [
            '58bc2de9-6ecc-4036-919e-64d4ea1207ff',
            '791149a0-7213-4613-a1c3-46ee55dca2a4',
        ],
    },
    {
        tagId: 'd539e003-5c0e-480a-8a4d-fac5b4db8d99',
        childTagIds: [
            '58bc2de9-6ecc-4036-919e-64d4ea1207ff',
            '791149a0-7213-4613-a1c3-46ee55dca2a4',
            'a3e97542-5a39-4f15-a6d2-5fa4e2b903e2',
            '275a4b3d-b230-4aae-a3b8-abb2e211d770',
        ],
    },
    {
        tagId: '275a4b3d-b230-4aae-a3b8-abb2e211d770',
        childTagIds: [
            '019b0bb2-50b2-4b74-9a15-9d4aaaaed6b4',
            'da27f4ac-6204-47da-a98f-765ca87869a4',
        ],
    },
];
