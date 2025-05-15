
export interface DeploymentResult {
  success: boolean;
  message: string;
  transactionId?: string;
  deploymentTimestamp?: string;
}

// Function to get deployment result from local storage
export const getDeploymentResult = (): DeploymentResult | null => {
  const result = localStorage.getItem('lastDeploymentResult');
  return result ? JSON.parse(result) : null;
};

// Function to save deployment result to local storage
export const saveDeploymentResult = (result: DeploymentResult): void => {
  localStorage.setItem('lastDeploymentResult', JSON.stringify(result));
};

export const integrationService = {
  getDeploymentResult,
  saveDeploymentResult
};
