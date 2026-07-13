/**
 * ResultsTable — the 7 life factors with Mother/Father/Total columns.
 */
export default function ResultsTable({ results }) {
  if (!results) return null;

  const { factors, motherTotal, fatherTotal, grandTotal } = results;

  return (
    <div className="table-container">
      <h2 className="section-title">Life Factor Breakdown</h2>
      <div className="table-wrapper">
        <table className="results-table">
          <thead>
            <tr>
              <th className="th-factor">Life Factor</th>
              <th className="th-mother">Mother</th>
              <th className="th-father">Father</th>
              <th className="th-total">Total</th>
            </tr>
          </thead>
          <tbody>
            {factors.map((factor, index) => (
              <tr key={factor.name} className="factor-row" style={{ animationDelay: `${index * 0.06}s` }}>
                <td className="td-factor">
                  <span className="factor-index">{index + 1}</span>
                  {factor.name}
                </td>
                <td className="td-mother">
                  <span className="value-pill mother-pill">{factor.mother.toFixed(3)}</span>
                </td>
                <td className="td-father">
                  <span className="value-pill father-pill">{factor.father.toFixed(3)}</span>
                </td>
                <td className="td-total">{factor.total.toFixed(3)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="totals-row">
              <td className="td-factor total-label">TOTAL</td>
              <td className="td-mother">
                <span className="value-pill mother-pill total-pill">{motherTotal.toFixed(3)}</span>
              </td>
              <td className="td-father">
                <span className="value-pill father-pill total-pill">{fatherTotal.toFixed(3)}</span>
              </td>
              <td className="td-total total-value">{grandTotal.toFixed(3)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}
