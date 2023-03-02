import React, { useEffect, useState } from 'react';
import { Search } from '../search';
import { HiArrowCircleLeft, HiArrowCircleRight } from "react-icons/hi";
import { sortBy } from '../../helpers/sortItems';
import { DwarfCard } from './DwarfCard';
import { DwarfFilter } from './DwarfFilter';

export const DwarfPlanets = () => {

  const [sortCriteria, setSorCriteria] = useState('name');
  const [dwarfPlanets, setDwarfPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalDwarfPlanets, setTotalDwarfPlanets] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(0);
  const [refresh, setRefresh] = useState(true)

  useEffect(() => {
    setLoading(false)
  }, [refresh])

  useEffect(() => {
    dwarfPlanets.sort(sortBy(sortCriteria))
    setRefresh(!refresh)
  }, [sortCriteria])

  useEffect(() => {
    fetch(`https://api.le-systeme-solaire.net/rest/bodies/?filter[]=bodyType,eq,Dwarf%20Planet`)
      .then((response) => response.json())
      .then((response) => {
        setDwarfPlanets(response.bodies);
        console.log(response.bodies);
        setTotalDwarfPlanets(response.bodies.length)
        if (response.bodies.length < 10) { setRecordsPerPage(response.bodies.length) } else { setRecordsPerPage(10) }
        setLoading(false)
      })

    return () => {
      dwarfPlanets.sort(sortBy(sortCriteria))
    }
  }, [loading])

  const previous = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1)
      setRecordsPerPage(recordsPerPage => recordsPerPage + 10)
    }
  }

  const next = () => {
    if (currentPage !== nPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = dwarfPlanets.slice(indexOfFirstRecord, indexOfLastRecord);
  const nPages = Math.ceil(dwarfPlanets.length / recordsPerPage)

  return (
    <div className='cardsConatinerTitle'>
    <h3>Dwarf Planets</h3>
    <div>
      <div className='searchContainer'>

        <div>
          <Search dwarfPlanets={dwarfPlanets} />
        </div>

        <div>
          <DwarfFilter dwarfPlanets={dwarfPlanets} setSorCriteria={setSorCriteria} sortCriteria={sortCriteria} />
        </div>

      </div>

      <DwarfCard dwarfPlanets={dwarfPlanets} currentRecords={currentRecords} />

    </div>

    {dwarfPlanets.length > 1 &&
      <div className='pageBrowser'>
        <button onClick={previous}><HiArrowCircleLeft /></button>
        <p>{currentPage} to {recordsPerPage} of {totalDwarfPlanets}</p>
        <button onClick={next}><HiArrowCircleRight /></button>
      </div>}

  </div>
  )
}
