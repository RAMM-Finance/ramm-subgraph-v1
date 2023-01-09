// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  ethereum,
  JSONValue,
  TypedMap,
  Entity,
  Bytes,
  Address,
  BigInt
} from "@graphprotocol/graph-ts";

export class ScoreUpdated extends ethereum.Event {
  get params(): ScoreUpdated__Params {
    return new ScoreUpdated__Params(this);
  }
}

export class ScoreUpdated__Params {
  _event: ScoreUpdated;

  constructor(event: ScoreUpdated) {
    this._event = event;
  }

  get trader(): Address {
    return this._event.parameters[0].value.toAddress();
  }

  get score(): BigInt {
    return this._event.parameters[1].value.toBigInt();
  }
}

export class reputationUpdated extends ethereum.Event {
  get params(): reputationUpdated__Params {
    return new reputationUpdated__Params(this);
  }
}

export class reputationUpdated__Params {
  _event: reputationUpdated;

  constructor(event: reputationUpdated) {
    this._event = event;
  }

  get marketId(): BigInt {
    return this._event.parameters[0].value.toBigInt();
  }

  get recipient(): Address {
    return this._event.parameters[1].value.toAddress();
  }
}

export class ReputationManager__getRepLogResultValue0Struct extends ethereum.Tuple {
  get collateralAmount(): BigInt {
    return this[0].toBigInt();
  }

  get bondAmount(): BigInt {
    return this[1].toBigInt();
  }

  get budget(): BigInt {
    return this[2].toBigInt();
  }

  get perpetual(): boolean {
    return this[3].toBoolean();
  }
}

export class ReputationManager__repLogsResult {
  value0: BigInt;
  value1: BigInt;
  value2: BigInt;
  value3: boolean;

  constructor(value0: BigInt, value1: BigInt, value2: BigInt, value3: boolean) {
    this.value0 = value0;
    this.value1 = value1;
    this.value2 = value2;
    this.value3 = value3;
  }

  toMap(): TypedMap<string, ethereum.Value> {
    let map = new TypedMap<string, ethereum.Value>();
    map.set("value0", ethereum.Value.fromUnsignedBigInt(this.value0));
    map.set("value1", ethereum.Value.fromUnsignedBigInt(this.value1));
    map.set("value2", ethereum.Value.fromUnsignedBigInt(this.value2));
    map.set("value3", ethereum.Value.fromBoolean(this.value3));
    return map;
  }

  getCollateralAmount(): BigInt {
    return this.value0;
  }

  getBondAmount(): BigInt {
    return this.value1;
  }

  getBudget(): BigInt {
    return this.value2;
  }

  getPerpetual(): boolean {
    return this.value3;
  }
}

export class ReputationManager extends ethereum.SmartContract {
  static bind(address: Address): ReputationManager {
    return new ReputationManager("ReputationManager", address);
  }

  calcImpliedProbability(
    bondAmount: BigInt,
    collateral_amount: BigInt,
    budget: BigInt
  ): BigInt {
    let result = super.call(
      "calcImpliedProbability",
      "calcImpliedProbability(uint256,uint256,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(bondAmount),
        ethereum.Value.fromUnsignedBigInt(collateral_amount),
        ethereum.Value.fromUnsignedBigInt(budget)
      ]
    );

    return result[0].toBigInt();
  }

  try_calcImpliedProbability(
    bondAmount: BigInt,
    collateral_amount: BigInt,
    budget: BigInt
  ): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "calcImpliedProbability",
      "calcImpliedProbability(uint256,uint256,uint256):(uint256)",
      [
        ethereum.Value.fromUnsignedBigInt(bondAmount),
        ethereum.Value.fromUnsignedBigInt(collateral_amount),
        ethereum.Value.fromUnsignedBigInt(budget)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  calculateMinScore(percentile: BigInt): BigInt {
    let result = super.call(
      "calculateMinScore",
      "calculateMinScore(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(percentile)]
    );

    return result[0].toBigInt();
  }

  try_calculateMinScore(percentile: BigInt): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "calculateMinScore",
      "calculateMinScore(uint256):(uint256)",
      [ethereum.Value.fromUnsignedBigInt(percentile)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  expectedIncrement(manager: Address): BigInt {
    let result = super.call(
      "expectedIncrement",
      "expectedIncrement(address):(uint256)",
      [ethereum.Value.fromAddress(manager)]
    );

    return result[0].toBigInt();
  }

  try_expectedIncrement(manager: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "expectedIncrement",
      "expectedIncrement(address):(uint256)",
      [ethereum.Value.fromAddress(manager)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  filterTraders(percentile: BigInt, utilizer: Address): Array<Address> {
    let result = super.call(
      "filterTraders",
      "filterTraders(uint256,address):(address[])",
      [
        ethereum.Value.fromUnsignedBigInt(percentile),
        ethereum.Value.fromAddress(utilizer)
      ]
    );

    return result[0].toAddressArray();
  }

  try_filterTraders(
    percentile: BigInt,
    utilizer: Address
  ): ethereum.CallResult<Array<Address>> {
    let result = super.tryCall(
      "filterTraders",
      "filterTraders(uint256,address):(address[])",
      [
        ethereum.Value.fromUnsignedBigInt(percentile),
        ethereum.Value.fromAddress(utilizer)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddressArray());
  }

  findTrader(trader: Address): BigInt {
    let result = super.call("findTrader", "findTrader(address):(uint256)", [
      ethereum.Value.fromAddress(trader)
    ]);

    return result[0].toBigInt();
  }

  try_findTrader(trader: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall("findTrader", "findTrader(address):(uint256)", [
      ethereum.Value.fromAddress(trader)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  getRepLog(
    trader: Address,
    marketId: BigInt
  ): ReputationManager__getRepLogResultValue0Struct {
    let result = super.call(
      "getRepLog",
      "getRepLog(address,uint256):((uint256,uint256,uint256,bool))",
      [
        ethereum.Value.fromAddress(trader),
        ethereum.Value.fromUnsignedBigInt(marketId)
      ]
    );

    return changetype<ReputationManager__getRepLogResultValue0Struct>(
      result[0].toTuple()
    );
  }

  try_getRepLog(
    trader: Address,
    marketId: BigInt
  ): ethereum.CallResult<ReputationManager__getRepLogResultValue0Struct> {
    let result = super.tryCall(
      "getRepLog",
      "getRepLog(address,uint256):((uint256,uint256,uint256,bool))",
      [
        ethereum.Value.fromAddress(trader),
        ethereum.Value.fromUnsignedBigInt(marketId)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      changetype<ReputationManager__getRepLogResultValue0Struct>(
        value[0].toTuple()
      )
    );
  }

  getTraders(): Array<Address> {
    let result = super.call("getTraders", "getTraders():(address[])", []);

    return result[0].toAddressArray();
  }

  try_getTraders(): ethereum.CallResult<Array<Address>> {
    let result = super.tryCall("getTraders", "getTraders():(address[])", []);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddressArray());
  }

  isRated(param0: Address): boolean {
    let result = super.call("isRated", "isRated(address):(bool)", [
      ethereum.Value.fromAddress(param0)
    ]);

    return result[0].toBoolean();
  }

  try_isRated(param0: Address): ethereum.CallResult<boolean> {
    let result = super.tryCall("isRated", "isRated(address):(bool)", [
      ethereum.Value.fromAddress(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  isReputable(trader: Address, percentile: BigInt): boolean {
    let result = super.call(
      "isReputable",
      "isReputable(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(trader),
        ethereum.Value.fromUnsignedBigInt(percentile)
      ]
    );

    return result[0].toBoolean();
  }

  try_isReputable(
    trader: Address,
    percentile: BigInt
  ): ethereum.CallResult<boolean> {
    let result = super.tryCall(
      "isReputable",
      "isReputable(address,uint256):(bool)",
      [
        ethereum.Value.fromAddress(trader),
        ethereum.Value.fromUnsignedBigInt(percentile)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBoolean());
  }

  repLogs(param0: Address, param1: BigInt): ReputationManager__repLogsResult {
    let result = super.call(
      "repLogs",
      "repLogs(address,uint256):(uint256,uint256,uint256,bool)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );

    return new ReputationManager__repLogsResult(
      result[0].toBigInt(),
      result[1].toBigInt(),
      result[2].toBigInt(),
      result[3].toBoolean()
    );
  }

  try_repLogs(
    param0: Address,
    param1: BigInt
  ): ethereum.CallResult<ReputationManager__repLogsResult> {
    let result = super.tryCall(
      "repLogs",
      "repLogs(address,uint256):(uint256,uint256,uint256,bool)",
      [
        ethereum.Value.fromAddress(param0),
        ethereum.Value.fromUnsignedBigInt(param1)
      ]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(
      new ReputationManager__repLogsResult(
        value[0].toBigInt(),
        value[1].toBigInt(),
        value[2].toBigInt(),
        value[3].toBoolean()
      )
    );
  }

  trader_scores(param0: Address): BigInt {
    let result = super.call(
      "trader_scores",
      "trader_scores(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );

    return result[0].toBigInt();
  }

  try_trader_scores(param0: Address): ethereum.CallResult<BigInt> {
    let result = super.tryCall(
      "trader_scores",
      "trader_scores(address):(uint256)",
      [ethereum.Value.fromAddress(param0)]
    );
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toBigInt());
  }

  traders(param0: BigInt): Address {
    let result = super.call("traders", "traders(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);

    return result[0].toAddress();
  }

  try_traders(param0: BigInt): ethereum.CallResult<Address> {
    let result = super.tryCall("traders", "traders(uint256):(address)", [
      ethereum.Value.fromUnsignedBigInt(param0)
    ]);
    if (result.reverted) {
      return new ethereum.CallResult();
    }
    let value = result.value;
    return ethereum.CallResult.fromValue(value[0].toAddress());
  }
}

export class ConstructorCall extends ethereum.Call {
  get inputs(): ConstructorCall__Inputs {
    return new ConstructorCall__Inputs(this);
  }

  get outputs(): ConstructorCall__Outputs {
    return new ConstructorCall__Outputs(this);
  }
}

export class ConstructorCall__Inputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }

  get _controller(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get _marketManager(): Address {
    return this._call.inputValues[1].value.toAddress();
  }
}

export class ConstructorCall__Outputs {
  _call: ConstructorCall;

  constructor(call: ConstructorCall) {
    this._call = call;
  }
}

export class DecrementScoreCall extends ethereum.Call {
  get inputs(): DecrementScoreCall__Inputs {
    return new DecrementScoreCall__Inputs(this);
  }

  get outputs(): DecrementScoreCall__Outputs {
    return new DecrementScoreCall__Outputs(this);
  }
}

export class DecrementScoreCall__Inputs {
  _call: DecrementScoreCall;

  constructor(call: DecrementScoreCall) {
    this._call = call;
  }

  get trader(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get update(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class DecrementScoreCall__Outputs {
  _call: DecrementScoreCall;

  constructor(call: DecrementScoreCall) {
    this._call = call;
  }
}

export class IncrementScoreCall extends ethereum.Call {
  get inputs(): IncrementScoreCall__Inputs {
    return new IncrementScoreCall__Inputs(this);
  }

  get outputs(): IncrementScoreCall__Outputs {
    return new IncrementScoreCall__Outputs(this);
  }
}

export class IncrementScoreCall__Inputs {
  _call: IncrementScoreCall;

  constructor(call: IncrementScoreCall) {
    this._call = call;
  }

  get trader(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get update(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class IncrementScoreCall__Outputs {
  _call: IncrementScoreCall;

  constructor(call: IncrementScoreCall) {
    this._call = call;
  }
}

export class RecordPullCall extends ethereum.Call {
  get inputs(): RecordPullCall__Inputs {
    return new RecordPullCall__Inputs(this);
  }

  get outputs(): RecordPullCall__Outputs {
    return new RecordPullCall__Outputs(this);
  }
}

export class RecordPullCall__Inputs {
  _call: RecordPullCall;

  constructor(call: RecordPullCall) {
    this._call = call;
  }

  get trader(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get marketId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get bondAmount(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get collateral_amount(): BigInt {
    return this._call.inputValues[3].value.toBigInt();
  }

  get budget(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }

  get perpetual(): boolean {
    return this._call.inputValues[5].value.toBoolean();
  }
}

export class RecordPullCall__Outputs {
  _call: RecordPullCall;

  constructor(call: RecordPullCall) {
    this._call = call;
  }
}

export class RecordPushCall extends ethereum.Call {
  get inputs(): RecordPushCall__Inputs {
    return new RecordPushCall__Inputs(this);
  }

  get outputs(): RecordPushCall__Outputs {
    return new RecordPushCall__Outputs(this);
  }
}

export class RecordPushCall__Inputs {
  _call: RecordPushCall;

  constructor(call: RecordPushCall) {
    this._call = call;
  }

  get trader(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get marketId(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }

  get bondPrice(): BigInt {
    return this._call.inputValues[2].value.toBigInt();
  }

  get premature(): boolean {
    return this._call.inputValues[3].value.toBoolean();
  }

  get redeemAmount(): BigInt {
    return this._call.inputValues[4].value.toBigInt();
  }
}

export class RecordPushCall__Outputs {
  _call: RecordPushCall;

  constructor(call: RecordPushCall) {
    this._call = call;
  }
}

export class SetTraderScoreCall extends ethereum.Call {
  get inputs(): SetTraderScoreCall__Inputs {
    return new SetTraderScoreCall__Inputs(this);
  }

  get outputs(): SetTraderScoreCall__Outputs {
    return new SetTraderScoreCall__Outputs(this);
  }
}

export class SetTraderScoreCall__Inputs {
  _call: SetTraderScoreCall;

  constructor(call: SetTraderScoreCall) {
    this._call = call;
  }

  get trader(): Address {
    return this._call.inputValues[0].value.toAddress();
  }

  get score(): BigInt {
    return this._call.inputValues[1].value.toBigInt();
  }
}

export class SetTraderScoreCall__Outputs {
  _call: SetTraderScoreCall;

  constructor(call: SetTraderScoreCall) {
    this._call = call;
  }
}

export class TestIncrementScoreCall extends ethereum.Call {
  get inputs(): TestIncrementScoreCall__Inputs {
    return new TestIncrementScoreCall__Inputs(this);
  }

  get outputs(): TestIncrementScoreCall__Outputs {
    return new TestIncrementScoreCall__Outputs(this);
  }
}

export class TestIncrementScoreCall__Inputs {
  _call: TestIncrementScoreCall;

  constructor(call: TestIncrementScoreCall) {
    this._call = call;
  }

  get update(): BigInt {
    return this._call.inputValues[0].value.toBigInt();
  }
}

export class TestIncrementScoreCall__Outputs {
  _call: TestIncrementScoreCall;

  constructor(call: TestIncrementScoreCall) {
    this._call = call;
  }
}
