import { ContainerClient } from "@azure/storage-blob";

export interface AzureStorageConfig {
  azureContainerClient: ContainerClient;
}
