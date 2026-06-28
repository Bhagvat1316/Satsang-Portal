import React from 'react';

/**
 * Table Component
 * 
 * Example usage:
 * <Table 
 *   headers={['Name', 'Role', 'Status']} 
 *   data={[{name: 'John', role: 'Admin', status: 'Active'}]}
 *   renderRow={(item) => (
 *     <tr key={item.name}>
 *       <td>{item.name}</td>
 *       ...
 *     </tr>
 *   )}
 * />
 */
const Table = ({ headers, data, renderRow, className = '' }) => {
  return (
    <div className={`overflow-x-auto rounded-card border border-surface-container-highest ${className}`}>
      <table className="w-full text-left border-collapse min-w-[800px]">
        <thead>
          <tr className="bg-surface-container-low border-b border-surface-container-highest">
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-4 text-label-md uppercase tracking-wider text-onSurface-variant font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-surface-container-lowest divide-y divide-surface-container-highest">
          {data.length > 0 ? (
            data.map((item, index) => renderRow(item, index))
          ) : (
            <tr>
              <td colSpan={headers.length} className="px-6 py-8 text-center text-onSurface-variant">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
