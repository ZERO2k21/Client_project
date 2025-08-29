"""
Sample Python file for CognaAI complexity analysis demonstration
Contains various complexity scenarios including nested loops, conditionals, and functions
"""

class DataAnalyzer:
    def __init__(self):
        self.results = []
        self.config = {
            'max_iterations': 1000,
            'threshold': 0.75,
            'debug_mode': False
        }
    
    def analyze_complex_dataset(self, dataset, filters=None, options=None):
        """
        High complexity function with multiple nested structures
        Demonstrates cyclomatic and cognitive complexity issues
        """
        if not dataset:
            return None
            
        if filters is None:
            filters = {}
            
        if options is None:
            options = {'strict': True, 'verbose': False}
        
        processed_data = []
        
        for i, record in enumerate(dataset):
            if record.get('status') == 'active':
                if record.get('type') in ['primary', 'secondary']:
                    if record.get('priority', 0) > 5:
                        if options.get('strict'):
                            # Deeply nested processing
                            for category in record.get('categories', []):
                                if category.get('enabled'):
                                    for subcategory in category.get('subcategories', []):
                                        if subcategory.get('weight', 0) > self.config['threshold']:
                                            for j, item in enumerate(subcategory.get('items', [])):
                                                if item.get('valid'):
                                                    if filters.get('include_metadata', True):
                                                        if item.get('metadata'):
                                                            for key, value in item['metadata'].items():
                                                                if isinstance(value, dict):
                                                                    if value.get('important'):
                                                                        try:
                                                                            processed_item = self._process_important_item(
                                                                                item, key, value, j, i
                                                                            )
                                                                            if processed_item:
                                                                                processed_data.append(processed_item)
                                                                        except Exception as e:
                                                                            if options.get('verbose'):
                                                                                print(f"Error processing item {j}: {e}")
                                                                            continue
                                                    else:
                                                        simple_item = self._process_simple_item(item)
                                                        if simple_item:
                                                            processed_data.append(simple_item)
                    else:
                        # Medium priority processing
                        for item in record.get('items', []):
                            if self._validate_item(item):
                                processed_data.append(self._process_medium_priority(item))
                elif record.get('type') == 'tertiary':
                    # Tertiary processing with different logic
                    if record.get('batch_process', False):
                        batch_results = self._process_batch(record)
                        processed_data.extend(batch_results)
                    else:
                        single_result = self._process_single(record)
                        if single_result:
                            processed_data.append(single_result)
                else:
                    # Unknown type handling
                    self._handle_unknown_type(record, processed_data)
            elif record.get('status') == 'pending':
                if record.get('auto_process', False):
                    auto_result = self._auto_process_pending(record)
                    if auto_result:
                        processed_data.append(auto_result)
            else:
                # Inactive or other status
                if options.get('include_inactive', False):
                    inactive_result = self._process_inactive(record)
                    if inactive_result:
                        processed_data.append(inactive_result)
        
        return self._finalize_results(processed_data)
    
    def _process_important_item(self, item, key, value, index, parent_index):
        """Medium complexity helper function"""
        try:
            result = {
                'id': item.get('id'),
                'key': key,
                'value': value,
                'index': index,
                'parent_index': parent_index,
                'processed_at': self._get_timestamp()
            }
            
            if value.get('calculate_score', False):
                score = self._calculate_importance_score(item, value)
                result['score'] = score
                
                if score > 0.8:
                    result['category'] = 'high'
                elif score > 0.5:
                    result['category'] = 'medium'
                else:
                    result['category'] = 'low'
            
            return result
            
        except Exception as e:
            print(f"Error in _process_important_item: {e}")
            return None
    
    def _process_simple_item(self, item):
        """Low complexity helper function"""
        return {
            'id': item.get('id'),
            'type': 'simple',
            'processed_at': self._get_timestamp()
        }
    
    def _validate_item(self, item):
        """Low complexity validation function"""
        return (
            item and 
            item.get('id') and 
            item.get('valid', True) and
            item.get('type') in ['standard', 'premium', 'basic']
        )
    
    def _process_medium_priority(self, item):
        """Medium complexity processing function"""
        result = {
            'id': item.get('id'),
            'priority': 'medium',
            'processed_at': self._get_timestamp()
        }
        
        if item.get('calculate_metrics', False):
            metrics = self._calculate_basic_metrics(item)
            result['metrics'] = metrics
        
        return result
    
    def _calculate_importance_score(self, item, value):
        """Medium complexity calculation function"""
        base_score = value.get('base_score', 0.5)
        multiplier = item.get('multiplier', 1.0)
        bonus = 0
        
        if item.get('premium', False):
            bonus += 0.2
        
        if item.get('featured', False):
            bonus += 0.1
        
        if item.get('trending', False):
            bonus += 0.15
        
        final_score = min(1.0, (base_score * multiplier) + bonus)
        return final_score
    
    def _calculate_basic_metrics(self, item):
        """Low complexity metrics calculation"""
        return {
            'size': len(str(item)),
            'complexity': len(item.keys()) if isinstance(item, dict) else 1,
            'timestamp': self._get_timestamp()
        }
    
    def _get_timestamp(self):
        """Simple utility function"""
        import time
        return int(time.time())
    
    def _process_batch(self, record):
        """Medium complexity batch processing"""
        results = []
        batch_items = record.get('batch_items', [])
        
        for item in batch_items:
            if self._validate_item(item):
                processed = self._process_simple_item(item)
                results.append(processed)
        
        return results
    
    def _process_single(self, record):
        """Low complexity single item processing"""
        return {
            'id': record.get('id'),
            'type': 'single',
            'processed_at': self._get_timestamp()
        }
    
    def _handle_unknown_type(self, record, processed_data):
        """Error handling function"""
        print(f"Warning: Unknown record type {record.get('type')}")
        processed_data.append({
            'id': record.get('id'),
            'type': 'unknown',
            'error': 'Unknown type',
            'processed_at': self._get_timestamp()
        })
    
    def _auto_process_pending(self, record):
        """Auto processing function"""
        return {
            'id': record.get('id'),
            'type': 'auto_pending',
            'processed_at': self._get_timestamp()
        }
    
    def _process_inactive(self, record):
        """Inactive record processing"""
        return {
            'id': record.get('id'),
            'type': 'inactive',
            'processed_at': self._get_timestamp()
        }
    
    def _finalize_results(self, processed_data):
        """Results finalization"""
        return {
            'total_processed': len(processed_data),
            'data': processed_data,
            'finalized_at': self._get_timestamp()
        }

# Simple function for comparison
def simple_add(a, b):
    """Very low complexity function"""
    return a + b

def medium_complexity_function(data_list):
    """Medium complexity function with some logic"""
    if not data_list:
        return []
    
    results = []
    for item in data_list:
        if isinstance(item, dict):
            if item.get('process', True):
                processed = {
                    'original': item,
                    'processed': True,
                    'score': item.get('value', 0) * 2
                }
                results.append(processed)
    
    return sorted(results, key=lambda x: x.get('score', 0), reverse=True)
