export class LoadFavoris {
  static readonly type = '[Favoris] Load Favoris';
}

export class AddFavoris {
  static readonly type = '[Favoris] Add Favoris';
  constructor(public pollutionId: string) {}
}

export class RemoveFavoris {
  static readonly type = '[Favoris] Remove Favoris';
  constructor(public pollutionId: string) {}
}

export class ToggleFavoris {
  static readonly type = '[Favoris] Toggle Favoris';
  constructor(public pollutionId: string) {}
}

export class ClearFavoris {
  static readonly type = '[Favoris] Clear All Favoris';
}
