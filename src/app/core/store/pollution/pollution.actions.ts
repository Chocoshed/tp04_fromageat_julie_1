import { Pollution } from '../../models/pollution.model';

export class LoadPollutions {
  static readonly type = '[Pollution] Load Pollutions';
}

export class LoadPollutionsSuccess {
  static readonly type = '[Pollution] Load Pollutions Success';
  constructor(public pollutions: Pollution[]) {}
}

export class LoadPollutionsFailure {
  static readonly type = '[Pollution] Load Pollutions Failure';
  constructor(public error: string) {}
}

export class LoadPollutionById {
  static readonly type = '[Pollution] Load Pollution By Id';
  constructor(public id: number) {}
}

export class LoadPollutionByIdSuccess {
  static readonly type = '[Pollution] Load Pollution By Id Success';
  constructor(public pollution: Pollution) {}
}

export class CreatePollution {
  static readonly type = '[Pollution] Create Pollution';
  constructor(public pollution: Pollution) {}
}

export class CreatePollutionSuccess {
  static readonly type = '[Pollution] Create Pollution Success';
  constructor(public pollution: Pollution) {}
}

export class UpdatePollution {
  static readonly type = '[Pollution] Update Pollution';
  constructor(public id: number, public pollution: Pollution) {}
}

export class UpdatePollutionSuccess {
  static readonly type = '[Pollution] Update Pollution Success';
  constructor(public pollution: Pollution) {}
}

export class DeletePollution {
  static readonly type = '[Pollution] Delete Pollution';
  constructor(public id: number) {}
}

export class DeletePollutionSuccess {
  static readonly type = '[Pollution] Delete Pollution Success';
  constructor(public id: number) {}
}

export class ClearSelectedPollution {
  static readonly type = '[Pollution] Clear Selected Pollution';
}
