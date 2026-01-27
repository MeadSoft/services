import nx from "@nx/eslint-plugin";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default [
    ...tseslint.configs.strictTypeChecked,
    ...nx.configs["flat/base"],
    ...nx.configs["flat/typescript"],
    ...nx.configs["flat/javascript"],
    prettierConfig,
    {
        ignores: [
            "**/dist",
            "**/node_modules",
            "**/.angular",
            "**/coverage",
            "**/.nx",
            "**/tmp",
            "**/*.min.js",
        ],
    },
    {
        // nx rules
        files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
        rules: {
            "@nx/enforce-module-boundaries": [
                "error",
                {
                    enforceBuildableLibDependency: true,
                    allow: ["^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$"],
                    depConstraints: [
                        {
                            sourceTag: "ui",
                            notDependOnLibsWithTags: ["server"],
                        },
                        {
                            sourceTag: "server",
                            notDependOnLibsWithTags: ["ui", "client"],
                        },
                        {
                            sourceTag: "query",
                            onlyDependOnLibsWithTags: [
                                "query",
                                "util",
                                "model",
                            ],
                        },
                        {
                            sourceTag: "util",
                            onlyDependOnLibsWithTags: ["util", "model"],
                        },
                        {
                            sourceTag: "domain",
                            onlyDependOnLibsWithTags: [
                                "domain",
                                "model",
                                "util",
                            ],
                        },
                        {
                            sourceTag: "*",
                            onlyDependOnLibsWithTags: ["*"],
                        },
                    ],
                },
            ],
        },
    },
    {
        // eslint rules
        files: [
            "**/*.ts",
            "**/*.tsx",
            "**/*.cts",
            "**/*.mts",
            "**/*.js",
            "**/*.jsx",
            "**/*.cjs",
            "**/*.mjs",
        ],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                projectService: true,
            },
            sourceType: "module",
        },
        plugins: {
            "@typescript-eslint": tseslint.plugin,
            prettier: prettierPlugin,
        },
        rules: {
            // none
            // I personally prefer using === false over !
            "@typescript-eslint/no-unnecessary-boolean-literal-compare": "off",
            // this is necessary so i can create constructors with interface typed variables
            // and then provide the interface value manually through a child classes super call.
            //
            // e.g.
            // interface IService { }
            // class BaseClass { constructor(service: IService) { ... } }
            // class ChildClass extends BaseClass {
            //    constructor(service: ServiceImpl) { super(service); } }
            //
            // This is useful when dealing with dependency injection frameworks like NestJS, since
            // interfaces cannot be injected cleanly, but concrete implementations can.
            "@typescript-eslint/no-useless-constructor": "off",
            // errors
            "no-loss-of-precision": "error",
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/no-unsafe-call": "error",
            "@typescript-eslint/no-unsafe-argument": "error",
            "@typescript-eslint/no-unsafe-assignment": "error",
            "@typescript-eslint/no-unsafe-declaration-merging": "error",
            "@typescript-eslint/no-unsafe-enum-comparison": "error",
            "@typescript-eslint/no-unsafe-function-type": "error",
            "@typescript-eslint/no-unsafe-member-access": "error",
            "@typescript-eslint/no-unsafe-return": "error",
            "@typescript-eslint/no-unsafe-type-assertion": "error",
            "@typescript-eslint/no-unsafe-unary-minus": "error",
            "no-unused-private-class-members": "off",
            "@typescript-eslint/no-unused-private-class-members": "error",
            "no-use-before-define": "off",
            "@typescript-eslint/no-use-before-define": "error",
            "@typescript-eslint/class-literal-property-style": "error",
            "@typescript-eslint/ban-ts-comment": "error",
            "@typescript-eslint/ban-tslint-comment": "error",
            "@typescript-eslint/await-thenable": "error",
            "@typescript-eslint/no-wrapper-object-types": "error",
            "@typescript-eslint/only-throw-error": "error",
            "@typescript-eslint/consistent-type-assertions": "error",
            "@typescript-eslint/prefer-as-const": "error",
            "@typescript-eslint/prefer-enum-initializers": "error",
            "@typescript-eslint/no-mixed-enums": "error",
            "@typescript-eslint/no-non-null-assertion": "error",
            "no-array-constructor": "off",
            "@typescript-eslint/no-array-constructor": "error",
            "@typescript-eslint/no-array-delete": "error",
            "@typescript-eslint/no-dynamic-delete": "error",
            "@typescript-eslint/no-confusing-void-expression": "error",
            "no-empty-function": "off",
            "@typescript-eslint/no-empty-function": "error",
            "@typescript-eslint/no-empty-object-type": "error",
            "@typescript-eslint/no-extra-non-null-assertion": "error",
            "@typescript-eslint/no-extraneous-class": [
                "error",
                { allowWithDecorator: true, allowEmpty: true },
            ],
            "@typescript-eslint/no-for-in-array": "error",
            "no-implied-eval": "off",
            "@typescript-eslint/no-implied-eval": "error",
            "no-invalid-this": "off",
            "@typescript-eslint/no-invalid-this": "error",
            "@typescript-eslint/no-invalid-void-type": "error",
            "no-loop-func": "off",
            "@typescript-eslint/no-loop-func": "error",
            "no-magic-numbers": "off",
            "@typescript-eslint/no-magic-numbers": "error",
            "@typescript-eslint/no-misused-new": "error",
            "@typescript-eslint/no-misused-promises": "error",
            "@typescript-eslint/no-misused-spread": "error",
            "@typescript-eslint/no-namespace": "error",
            "@typescript-eslint/no-non-null-asserted-nullish-coalescing":
                "error",
            "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
            "@typescript-eslint/no-redundant-type-constituents": "error",
            "@typescript-eslint/no-require-imports": "error",
            "@typescript-eslint/no-this-alias": "error",
            "no-shadow": "off",
            "@typescript-eslint/no-shadow": "error",
            "@typescript-eslint/no-unnecessary-condition": "error",
            "@typescript-eslint/no-unnecessary-type-parameters": "error",
            "@typescript-eslint/no-useless-default-assignment": "error",
            "@typescript-eslint/no-useless-empty-export": "error",
            "@typescript-eslint/no-var-requires": "error",
            "@typescript-eslint/prefer-reduce-type-parameter": "error",
            "@typescript-eslint/promise-function-async": "error",
            "@typescript-eslint/related-getter-setter-pairs": "error",
            "@typescript-eslint/require-array-sort-compare": "error",
            "@typescript-eslint/return-await": "error",
            "@typescript-eslint/switch-exhaustiveness-check": "error",
            "@typescript-eslint/unified-signatures": "error",
            // warnings
            "@typescript-eslint/no-unused-vars": "warn",
            "@typescript-eslint/no-floating-promises": "warn",
            "@typescript-eslint/no-meaningless-void-operator": "warn",
            "@typescript-eslint/no-unnecessary-type-constraint": "warn",
            "@typescript-eslint/no-unnecessary-type-assertion": "warn",
            "@typescript-eslint/no-base-to-string": "warn",
            "@typescript-eslint/no-duplicate-type-constituents": "warn",
            "@typescript-eslint/no-unnecessary-type-assertion": "warn",
            "@typescript-eslint/no-unnecessary-type-conversion": "warn",
            "no-useless-constructor": "off",
            "@typescript-eslint/prefer-find": "warn",
            "@typescript-eslint/prefer-function-type": "warn",
            "@typescript-eslint/prefer-for-of": "warn",
            "@typescript-eslint/prefer-includes": "warn",
            "@typescript-eslint/no-unnecessary-parameter-property-assignment":
                "warn",
            "@typescript-eslint/no-unnecessary-template-expression": "warn",
            "@typescript-eslint/no-unnecessary-type-arguments": "warn",
            "@typescript-eslint/prefer-literal-enum-member": "warn",
            "@typescript-eslint/prefer-nullish-coalescing": "warn",
            "@typescript-eslint/prefer-optional-chain": "warn",
            "@typescript-eslint/prefer-readonly": "warn",
            "@typescript-eslint/prefer-regexp-exec": "warn",
            "@typescript-eslint/prefer-return-this-type": "warn",
            "@typescript-eslint/prefer-string-starts-ends-with": "warn",
            "@typescript-eslint/sort-type-constituents": "warn",
            "@typescript-eslint/strict-boolean-expressions": "warn",
            // prettier
            "prettier/prettier": "error",
        },
    },
];
