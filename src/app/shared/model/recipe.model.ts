export interface Recipe {
    imgUrl?: string;
    id: number;
    name: string;
    slag: string;
    instructions: string,
    ingredients: Ingredient[] 
}

export interface Ingredient {
    ingredientId: number,
    quantity: number
}

export interface ToCook {
    id: number,
    quantity: number
}