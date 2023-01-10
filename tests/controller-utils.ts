import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import { MarketInitiated } from "../generated/Controller/Controller"

export function createMarketInitiatedEvent(
  marketId: BigInt,
  vault: Address,
  recipient: Address,
  pool: Address,
  longZCB: Address,
  shortZCB: Address
): MarketInitiated {
  let marketInitiatedEvent = (newMockEvent()) as MarketInitiated;

  marketInitiatedEvent.parameters = new Array()

  marketInitiatedEvent.parameters.push(
    new ethereum.EventParam(
      "marketId",
      ethereum.Value.fromUnsignedBigInt(marketId)
    )
  )
  marketInitiatedEvent.parameters.push(
    new ethereum.EventParam("recipient", ethereum.Value.fromAddress(recipient))
  )

  return marketInitiatedEvent
}
