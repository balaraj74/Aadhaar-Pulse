"""
Data.gov.in API Client
Fetches official government Aadhaar datasets
"""
import httpx
import logging
from typing import Dict, List, Any, Optional
from datetime import datetime
import asyncio
from config import settings

logger = logging.getLogger(__name__)

class DataGovClient:
    """Client for interacting with Data.gov.in APIs"""
    
    def __init__(self):
        self.base_url = settings.DATA_GOV_BASE_URL
        self.api_key = settings.DATA_GOV_API_KEY
        self.timeout = 30.0
        self._cache: Dict[str, Any] = {}
        self._cache_timestamps: Dict[str, datetime] = {}
    
    def _get_cache_key(self, resource_id: str, params: Dict) -> str:
        """Generate cache key from resource and params"""
        params_str = "&".join(f"{k}={v}" for k, v in sorted(params.items()))
        return f"{resource_id}:{params_str}"
    
    def _is_cache_valid(self, key: str) -> bool:
        """Check if cached data is still valid"""
        if key not in self._cache_timestamps:
            return False
        age = (datetime.now() - self._cache_timestamps[key]).total_seconds()
        return age < settings.CACHE_TTL_SECONDS
    
    async def fetch_resource(
        self,
        resource_id: str,
        limit: int = 1000,
        offset: int = 0,
        filters: Optional[Dict[str, str]] = None,
        format: str = "json"
    ) -> Dict[str, Any]:
        """
        Fetch data from Data.gov.in API
        
        Args:
            resource_id: The unique identifier for the dataset
            limit: Number of records to fetch (max 1000 per call)
            offset: Starting position for pagination
            filters: Optional filters to apply
            format: Response format (json/csv)
        
        Returns:
            API response data
        """
        params = {
            "api-key": self.api_key,
            "format": format,
            "limit": str(limit),
            "offset": str(offset),
        }
        
        if filters:
            for key, value in filters.items():
                params[f"filters[{key}]"] = value
        
        # Check cache
        cache_key = self._get_cache_key(resource_id, params)
        if self._is_cache_valid(cache_key):
            logger.debug(f"Returning cached data for {resource_id}")
            return self._cache[cache_key]
        
        url = f"{self.base_url}/{resource_id}"
        
        try:
            async with httpx.AsyncClient(timeout=self.timeout) as client:
                response = await client.get(url, params=params)
                response.raise_for_status()
                data = response.json()
                
                # Cache the response
                self._cache[cache_key] = data
                self._cache_timestamps[cache_key] = datetime.now()
                
                logger.info(f"Fetched {len(data.get('records', []))} records from {resource_id}")
                return data
                
        except httpx.HTTPStatusError as e:
            logger.error(f"HTTP error fetching {resource_id}: {e.response.status_code}")
            raise
        except httpx.RequestError as e:
            logger.error(f"Request error fetching {resource_id}: {str(e)}")
            raise
        except Exception as e:
            logger.error(f"Unexpected error fetching {resource_id}: {str(e)}")
            raise
    
    async def fetch_all_records(
        self,
        resource_id: str,
        filters: Optional[Dict[str, str]] = None,
        max_records: int = 10000
    ) -> List[Dict[str, Any]]:
        """
        Fetch all records with pagination
        
        Args:
            resource_id: Dataset resource ID
            filters: Optional filters
            max_records: Maximum records to fetch
        
        Returns:
            List of all records
        """
        all_records = []
        offset = 0
        limit = 1000
        
        while len(all_records) < max_records:
            try:
                data = await self.fetch_resource(
                    resource_id=resource_id,
                    limit=limit,
                    offset=offset,
                    filters=filters
                )
                
                records = data.get("records", [])
                if not records:
                    break
                
                all_records.extend(records)
                offset += limit
                
                # Rate limiting
                await asyncio.sleep(0.1)
                
            except Exception as e:
                logger.error(f"Error fetching batch at offset {offset}: {str(e)}")
                break
        
        return all_records[:max_records]


# Singleton instance
data_gov_client = DataGovClient()
