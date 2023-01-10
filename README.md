yarn
graph auth --product hosted-service <ACCESS_TOKEN>

## to deploy
graph codegen

graph build
*(comment out the code error that you get)

yarn deploy

## w/ new deployments  + updates
update index.ts with the controller and marketManager addresses

in subgraph.yaml, for each dataSource, update the source object, address, startBlock

If you need to update the abis bc contracts changed, will need to update the abis folder and run graph codegen.

1. if new event added or updated event, go to mappings and add the event under the datasource that the event comes from. handlers are specified under mappings for each datasource/template

##### to update entites (data shape, new fields, etc.)
need to go to schema.graphql and add new fields to the entities you want, then update mappings accordingly.

updating schema.graphql https://thegraph.com/docs/en/developing/creating-a-subgraph/#defining-entities

updating mappings - https://thegraph.com/docs/en/developing/creating-a-subgraph/#writing-mappings
https://thegraph.com/docs/en/developing/assemblyscript-api/
